import pandas as pd
from sklearn.model_selection import train_test_split

def load_and_preprocess_data():
    df = pd.read_csv('backend/data/emscad.csv')

    df = df.drop_duplicates()

    required_cols = ['title', 'description', 'fraudulent']
    df = df.dropna(subset=required_cols)

    df['fraudulent'] = df['fraudulent'].map({'t': 1, 'f': 0})

    text_columns = [
        'title', 'location', 'department', 'salary_range',
        'company_profile', 'description', 'requirements',
        'benefits', 'telecommuting', 'has_company_logo',
        'has_questions', 'employment_type', 'required_experience',
        'required_education', 'industry', 'function'
    ]
    df[text_columns] = df[text_columns].fillna('')
    df['combined_text'] = df[text_columns].astype(str).agg(' '.join, axis=1)

    df_train, df_test = train_test_split(
        df, test_size=0.2, stratify=df['fraudulent'], random_state=42
    )

    df_train.to_csv('backend/data/train.csv', index=False)
    df_test.to_csv('backend/data/test.csv', index=False)

    fraud_total = df['fraudulent'].sum()
    legit_total = (df['fraudulent'] == 0).sum()
    print(f"Dataset size    : {len(df)} rows ({fraud_total} fraudulent, {legit_total} legitimate)")
    print(f"Training samples: {len(df_train)}")
    print(f"Testing samples : {len(df_test)}")

    return len(df_train), len(df_test)


if __name__ == '__main__':
    train_samples, test_samples = load_and_preprocess_data()