import pandas as pd
import random
from datetime import datetime, timedelta

# Helper function to generate random data
def random_date(start, end):
    return start + timedelta(seconds=random.randint(0, int((end - start).total_seconds())))

# Generating Users
user_data = []
for i in range(1, 100001):
    user_data.append({
        'user_id': i,
        'username': f'user_{i}',
        'email': f'user_{i}@example.com'
    })
users_df = pd.DataFrame(user_data)

# Generating Posts
post_data = []
for i in range(1, 100001):
    user_id = random.randint(1, 100000)
    post_data.append({
        'post_id': i,
        'user_id': user_id,
        'title': f'Post Title {i}',
        'content': f'Content for post {i}',
        'created_at': random_date(datetime(2024, 1, 1), datetime(2024, 12, 31)).strftime('%Y-%m-%d %H:%M:%S')
    })
posts_df = pd.DataFrame(post_data)

# Generating Comments (100,000 records)
comment_data = []
for i in range(1, 100001):
    post_id = random.randint(1, 100000)
    user_id = random.randint(1, 100000)
    comment_data.append({
        'comment_id': i,
        'post_id': post_id,
        'user_id': user_id,
        'comment': f'Comment {i} on post {post_id}',
        'created_at': random_date(datetime(2024, 1, 1), datetime(2024, 12, 31)).strftime('%Y-%m-%d %H:%M:%S')
    })
comments_df = pd.DataFrame(comment_data)

# Saving the CSV files for the 'before optimization' case
users_df.to_csv('users_before.csv', index=False)
posts_df.to_csv('posts_before.csv', index=False)
comments_df.to_csv('comments_before.csv', index=False)

# After Optimization: Embedding comments and user data in posts
post_data_optimized = []
for i in range(1, 100001):
    user_id = random.randint(1, 100000)
    post_comments = []
    for _ in range(random.randint(1, 5)):  # Randomly generate 1-5 comments
        comment_user_id = random.randint(1, 100000)
        post_comments.append({
            'user_id': comment_user_id,
            'username': f'user_{comment_user_id}',
            'email': f'user_{comment_user_id}@example.com',
            'comment': f'Comment on post {i}',
            'created_at': random_date(datetime(2024, 1, 1), datetime(2024, 12, 31)).strftime('%Y-%m-%d %H:%M:%S')
        })
    
    post_data_optimized.append({
        'post_id': i,
        'user_id': user_id,
        'username': f'user_{user_id}',
        'email': f'user_{user_id}@example.com',
        'title': f'Post Title {i}',
        'content': f'Content for post {i}',
        'created_at': random_date(datetime(2024, 1, 1), datetime(2024, 12, 31)).strftime('%Y-%m-%d %H:%M:%S'),
        'comments': str(post_comments)
    })

posts_df_optimized = pd.DataFrame(post_data_optimized)

# Saving the CSV file for the 'after optimization' case
posts_df_optimized.to_csv('posts_after.csv', index=False)
