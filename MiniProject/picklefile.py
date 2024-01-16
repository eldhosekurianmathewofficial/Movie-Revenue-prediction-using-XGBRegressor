import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder, LabelEncoder
from xgboost import XGBRegressor
from sklearn import metrics
import pickle

# Load the dataset
df = pd.read_csv("director_with_date_info.csv")

# Select numeric and categorical columns
numerics = ['int16', 'int32', 'int64', 'float16', 'float32', 'float64']
categoricals = ['genre', 'original_language']  # Add other categorical columns as needed

# Fill missing values in numeric columns with the median
df_train = df.select_dtypes(include=numerics)
df_train = df_train.fillna(df_train.median())

# Label encode categorical columns
label_encoder = LabelEncoder()
for column in categoricals:
    df[column] = label_encoder.fit_transform(df[column])

# Split the data into features and target variable
X = df.drop(['revenue', 'id', 'Main_Actor', 'Main_Actress', 'Director', 'title'], axis=1)
y = df['revenue']

# Print the columns of X
print("Columns of X:", X.columns)

# Split the data into train and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Define transformers for numeric and categorical features
numeric_transformer = Pipeline(steps=[
    ('scaler', StandardScaler())
])

categorical_transformer = Pipeline(steps=[
    ('onehot', OneHotEncoder(handle_unknown='ignore'))
])

# Combine transformers using ColumnTransformer
preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, X.select_dtypes(include=numerics).columns),
        ('cat', categorical_transformer, categoricals)
    ], 
    remainder='passthrough')  # Add remainder='passthrough' to include non-transformed columns

# Create an XGBRegressor model with the best hyperparameters
best_xgb_model = XGBRegressor(learning_rate=0.1, max_depth=4, n_estimators=300)
# Create a pipeline with preprocessing and model
pipeline = Pipeline(steps=[('preprocessor', preprocessor),
                             ('model', best_xgb_model)])

# Train the model on the training set
pipeline.fit(X_train, y_train)


# Train the model on the training set
pipeline.fit(X_train, y_train)

# Predictions on the test set
predictions = pipeline.predict(X_test)

# Evaluate the model on the test set
r2 = metrics.r2_score(y_test, predictions)
mse = metrics.mean_squared_error(y_test, predictions)

print("R-Squared on Test Set:", r2)
print("Mean Squared Error on Test Set:", mse)

# Add actual vs predicted values to a DataFrame for comparison
comparison_df = pd.DataFrame({'Actual': y_test, 'Predicted': predictions})

# Display the first few rows of the comparison DataFrame
print("\nActual vs Predicted Values on Test Set:")
print(comparison_df.head())

# Save the model using pickle
with open('model.pkl', 'wb') as model_file:
    pickle.dump(pipeline, model_file)
