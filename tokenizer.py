import pickle
import pandas as pd
from transformers import DistilBertTokenizer

## Configuration -------------------------------------------------------------

MODEL_NAME = "distilbert-base-uncased"
MAX_LENGTH = 256
TRAIN_CSV = "Data/train.csv"
TEST_CSV = "Data/test.csv"
TRAIN_PKL = "Data/train_tokens.pkl"
TEST_PKL = "Data/test_tokens.pkl"

## ---------------------------------------------------------------------------

def tokenize_split(df: pd.DataFrame, tokenizer: DistilBertTokenizer) -> dict:
    """
    Tokenizers the 'combined_text' column of the dataframe and returns a dictionary with the tokens and their corresponding ids, labels and attention masks.
    """

    texts = df['combined_text'].tolist()

    encoding = tokenizer(
        texts,
        max_length=MAX_LENGTH,
        padding='max_length',
        truncation=True,
        return_attention_mask=True,
        return_tensors=None
    )

    return {
        "input_ids" : encoding['input_ids'],
        "attention_mask" : encoding['attention_mask'],
        "labels" : (df['fraudulent'] == 't').astype(int).tolist(),
    }

def save_tokens(data: dict, path:str) -> None:
    """
    Saves the tokens to a pickle file in the Data directory.
    """
    with open(path, 'wb') as f:
        pickle.dump(data, f)
    print(f"Tokens saved to {path}")
    print(f"Total samples: {len(data['labels'])}")
    print(f"Fraudulent samples: {sum(data['labels'])}")

def main():
    print(f"Loading tokenizer: {MODEL_NAME}")
    tokenizer = DistilBertTokenizer.from_pretrained(MODEL_NAME)

    print("\nTokenizing training split")
    df_train = pd.read_csv(TRAIN_CSV)
    train_tokens = tokenize_split(df_train, tokenizer)
    save_tokens(train_tokens, TRAIN_PKL)

    print("\nTokenizing testing split")
    df_test = pd.read_csv(TEST_CSV)
    test_tokens = tokenize_split(df_test, tokenizer)
    save_tokens(test_tokens, TEST_PKL)

    print("\nTokenization complete")
    print(f"Sequence length: {len(train_tokens['input_ids'][0])}")
    print(f"Vocab size: {len(tokenizer.vocab)}")

if __name__ == '__main__':
    main()