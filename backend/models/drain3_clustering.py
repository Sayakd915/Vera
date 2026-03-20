import json
import pickle
import pandas as pd 
from drain3 import TemplateMiner
from drain3.template_miner_config import TemplateMinerConfig

## ----Config---------------------------------------------------------------

TRAIN_CSV = "backend/data/train.csv"
TEST_CSV = "backend/data/test.csv"
DRAIN_MODEL_PATH = "backend/models/drain3_model.pkl"
TRAIN_CLUSTERS_PATH = "backend/models/train_clusters.csv"
TEST_CLUSTERS_PATH = "backend/models/test_clusters.csv"
CLUSTER_REPORT_PATH = "backend/models/cluster_report.json"

## -------------------------------------------------------------------------

def build_drain_config() -> TemplateMinerConfig:
    """
    Configures Drain3 for job posting text

    Key knobs:
    - depth : max depth of prefix tree (default 4, lower for better generalization)
    - sim_th : similarity threshold for merging clusters (0.4 to catch spam)

    Variants:
    - max_children : max branches per internal node
    - parametrize_numerical_tokens : replace numbers with <NUM>
    
    """
    config = TemplateMinerConfig()
    config.drain_depth = 4
    config.drain_sim_th = 0.4
    config.drain_max_children = 100
    config.drain_parametrize_numerical_tokens = True
    return config


def fit_drain_model(texts: list[str]) -> tuple[TemplateMiner, list[int]]:
    """
    Fits Drain3 model on given texts
    
    Args:
        texts: list of job posting texts
        
    Returns:
        tuple of (trained_model, cluster_ids)
    """
    config = build_drain_config()
    miner = TemplateMiner(persistence_handler=None, config=config)
    cluster_ids = []
    
    for text in texts:
        result = miner.add_log_message(text.replace("\n", " "))
        cluster_ids.append(result["cluster_id"])

    return miner, cluster_ids

def transform_drain(miner:TemplateMiner, texts: list[str]) -> list[int]:
    """
    Assigns cluster ids to unseen text using the fitted miner.
    Texts that don't match any existing template get cluster id 0.
    """

    cluster_ids = []
    for text in texts:
        result = miner.match(text.replace("\n", " "))
        cluster_ids.append(result.cluster_id if result else 0)
    return cluster_ids

def save_miner(miner:TemplateMiner, path:str) -> None:
    """
    Saves the trained Drain3 model to a pickle file.
    """
    with open(path, "wb") as f:
        pickle.dump(miner, f)
    print(f"Drain3 model saved to {path}")

def save_cluster_report(miner:TemplateMiner, path:str) -> None:
    """
    Dumps human-readable json report of every discovered template
    """

    report = [
        {
            "cluster_id": cluster.cluster_id,
            "size": cluster.size,
            "template": cluster.get_template()
        }
        for cluster in miner.drain.clusters
    ]

    report.sort(key=lambda x: x["size"], reverse=True)

    with open(path, "w") as f:
        json.dump(report,f,indent=2)

    print(f"Cluster report saved to {path}")
    print(f"Total clusters found: {len(report)}")

def main():
    df_train = pd.read_csv(TRAIN_CSV)
    df_test = pd.read_csv(TEST_CSV)

    train_texts = df_train["combined_text"].astype(str).tolist()
    test_texts = df_test["combined_text"].astype(str).tolist()

    print("Fitting drain3 model on training corpus")
    miner, train_cluster_ids = fit_drain_model(train_texts)

    unique_clusters = len(set(train_cluster_ids))
    print(f"Found {unique_clusters} unique clusters in training data")

    print("\nAssigning cluster IDs to test data")
    test_cluster_ids = transform_drain(miner, test_texts)

    unseen = sum(1 for c in test_cluster_ids if c==0)    
    print(f"Found {unseen} unseen job postings in test data")

    df_train["cluster_id"] = train_cluster_ids
    df_test["cluster_id"] = test_cluster_ids

    df_train.to_csv(TRAIN_CLUSTERS_PATH, index=False)
    df_test.to_csv(TEST_CLUSTERS_PATH, index=False)

    print(f"\nSaved clustered training data to {TRAIN_CLUSTERS_PATH}")
    print(f"\nSaved clustered test data to {TEST_CLUSTERS_PATH}")

    save_miner(miner, DRAIN_MODEL_PATH)
    save_cluster_report(miner, CLUSTER_REPORT_PATH)

    print("\nDrain3 clustering complete")

if __name__ == "__main__":
    main()