"""
Semantic cluster embeddings to be used for DistilBERT training.
Drain3 to be used for live scraped data
"""

import json
import pickle
import numpy as np 
import pandas as pd 
from sentence_transformers import SentenceTransformer
import hdbscan

## Config -----------------------------------------------------------------------
SBERT_MODEL = "all-MiniLM-L6-v2"
TRAIN_CSV = "backend/data/train.csv"
TEST_CSV = "backend/data/test.csv"
EMBEDDING_PATH = "backend/data/embeddings.pkl"
MODEL_PATH = "backend/models/saved/sbert_model.pkl"
TRAIN_CLUSTERS = "backend/data/train_clusters.csv"
TEST_CLUSTERS = "backend/data/test_clusters.csv"
CLUSTER_REPORT =  "backend/data/cluster_report.json"
##-------------------------------------------------------------------------------

## HDBSCAN Params ---------------------------------------------------------------
# min_cluster_size : minimum number of postings to form a cluster, lower for more clusters
# min_samples : controls the conservativeness of clustering, set to min_cluster_size for default
# metric : cosine similarity

MIN_CLUSTER_SIZE = 50
MIN_SAMPLES = 50 
METRIC = "euclidean"
##--------------------------------------------------------------------------------

def embed_text(texts : list[str], model: SentenceTransformer) -> np.ndarray:
    """
    Embeds the list of texts using SentenceTransformer.
    """
    print(f"Embedding {len(texts)} texts using {SBERT_MODEL} : ")
    embeddings = model.encode(
        texts,
        batch_size=64,
        show_progress_bar=True,
        convert_to_numpy=True,
        normalize_embeddings=True, #L2 normalization for cosine similarity
    )

    return embeddings

def fit_hdbscan(embeddings : np.ndarray) -> tuple[hdbscan.HDBSCAN, np.ndarray]:
    """
    Fits HDBSCAN to the embeddings.

    
    Returns:
        clusterer   : fitted HDBSCAN model (used to predict test clusters)
        cluster_ids : integer cluster ID per training sample.
                      -1 means the point was classified as noise (no cluster).
    """
    print(f"Fitting HDBSCAN to {len(embeddings)} embeddings using metric: {METRIC}")
    clusterer = hdbscan.HDBSCAN(
        min_cluster_size=MIN_CLUSTER_SIZE,
        min_samples=MIN_SAMPLES,
        metric=METRIC,
        cluster_selection_method="eom",
        prediction_data=True,
    )
    cluster_ids = clusterer.fit_predict(embeddings)
    return clusterer, cluster_ids

def transform_hdbscan(clusterer: hdbscan.HDBSCAN, embeddings: np.ndarray) -> np.ndarray:
    """
    Assigns cluster IDs to unseen test embeddings using approximate_predict.
    Points too dissimilar to any training cluster get assigned -1 (noise).
    """
    cluster_ids, _ = hdbscan.approximate_predict(clusterer, embeddings)
    return cluster_ids

def save_cluster_report(
    df: pd.DataFrame,
    cluster_ids: np.ndarray,
    path: str
) -> None:
    """
    Saves a human-readable JSON report of discovered clusters.
    Noise points (cluster_id = -1) are reported separately.
 
    Each cluster entry includes:
      - cluster_id
      - size            : number of postings in the cluster
      - fraud_rate      : fraction of fraudulent postings (if label available)
      - sample_titles   : up to 3 example job titles for manual inspection
    """
    df = df.copy()
    df["cluster_id"] = cluster_ids
 
    report = []
    for cid in sorted(df["cluster_id"].unique()):
        subset = df[df["cluster_id"] == cid]
        entry = {
            "cluster_id":    int(cid),
            "size":          int(len(subset)),
            "fraud_rate":    (
                round(float(subset["fraudulent"].mean()), 4)
                if "fraudulent" in df.columns else None
            ),
            "sample_titles": subset["title"].dropna().head(3).tolist(),
        }
        report.append(entry)
 
    # Sort: noise last, then by size descending
    report.sort(key=lambda x: (x["cluster_id"] == -1, -x["size"]))
 
    with open(path, "w") as f:
        json.dump(report, f, indent=2)
 
    noise_count = int((cluster_ids == -1).sum())
    print(f"  Cluster report saved → {path}")
    print(f"  Noise points (cluster_id = -1): {noise_count} "
          f"({100 * noise_count / len(cluster_ids):.1f}%)")
 
 
def main():
    df_train = pd.read_csv(TRAIN_CSV)
    df_test  = pd.read_csv(TEST_CSV)
 
    train_texts = df_train["combined_text"].astype(str).tolist()
    test_texts  = df_test["combined_text"].astype(str).tolist()
 
    print("Loading SBERT model …")
    sbert = SentenceTransformer(SBERT_MODEL)
 
    print("\n[1/4] Embedding training data …")
    train_embeddings = embed_text(train_texts, sbert)
 
    with open(EMBEDDING_PATH, "wb") as f:
        pickle.dump(train_embeddings, f)
    print(f"  Embeddings cached → {EMBEDDING_PATH}")
 
    print("\n[2/4] Embedding test data …")
    test_embeddings = embed_text(test_texts, sbert)
 
    print("\n[3/4] Clustering training embeddings …")
    clusterer, train_cluster_ids = fit_hdbscan(train_embeddings)
 
    unique_clusters = len(set(train_cluster_ids)) - (1 if -1 in train_cluster_ids else 0)
    print(f"  {unique_clusters} semantic clusters discovered")
 
    print("\n[4/4] Assigning clusters to test data …")
    test_cluster_ids = transform_hdbscan(clusterer, test_embeddings)
 
    df_train["cluster_id"] = train_cluster_ids
    df_test["cluster_id"]  = test_cluster_ids
 
    df_train.to_csv(TRAIN_CLUSTERS, index=False)
    df_test.to_csv(TEST_CLUSTERS,   index=False)
    print(f"\n  Enriched CSVs saved:")
    print(f"    {TRAIN_CLUSTERS}")
    print(f"    {TEST_CLUSTERS}")
 
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(clusterer, f)
    print(f"  HDBSCAN model saved → {MODEL_PATH}")
 
    save_cluster_report(df_train, train_cluster_ids, CLUSTER_REPORT)
 
    print("\n=== Semantic Clustering Complete ===")
    print(f"  SBERT model       : {SBERT_MODEL} (384-dim embeddings)")
    print(f"  Training samples  : {len(train_texts)}")
    print(f"  Unique clusters   : {unique_clusters}")
    print(f"  Noise points      : {int((train_cluster_ids == -1).sum())}")
 
    if "fraudulent" in df_train.columns:
        high_risk = (
            df_train.groupby("cluster_id")["fraudulent"]
            .mean()
            .pipe(lambda s: s[s > 0.8])
        )
        print(f"  High-risk clusters (fraud rate > 0.8): {len(high_risk)}")
 
 
if __name__ == "__main__":
    main()