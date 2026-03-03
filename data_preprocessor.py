import pandas as pd
from sklearn.model_selection import train_test_split

def load_and_preprocess_data():
    df = pd.read_csv('Data/emscad.csv')
    
    df = df.drop_duplicates()
    df = df.dropna()
    
    text_columns = [
        'title', 'location', 'department', 'salary_range', 
        'company_profile', 'description', 'requirements', 
        'benefits', 'telecommuting', 'has_company_logo', 
        'has_questions', 'employment_type', 'required_experience', 
        'required_education', 'industry', 'function'
    ]
    
    df['combined_text'] = df[text_columns].astype(str).agg(' '.join, axis=1)
    
    df_train, df_test = train_test_split(
        df, test_size=0.2, stratify=df['fraudulent'], random_state=42
    )
    
    df_train.to_csv('Data/train.csv', index=False)
    df_test.to_csv('Data/test.csv', index=False)
    
    return len(df_train), len(df_test)

if __name__ == '__main__':
    train_samples, test_samples = load_and_preprocess_data()
    print("Training samples:", train_samples)
    print("Testing samples:", test_samples) 