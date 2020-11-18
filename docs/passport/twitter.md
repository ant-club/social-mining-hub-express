# twitter passport

## 开通

在[twitter开发者平台](https://developer.twitter.com/en/apps)申请APP即可。

## 配置项

```json
{
  "PASSPORT": {
    "TWITTER_CONSUMER_KEY": "key",
    "TWITTER_CONSUMER_SECRET": "secret",
    "TWITTER_CALLBACK_URL": "http://localhost:3004/auth/facebook/callback"
  }
}
```

## 申请

### In your words

Our needs are quite simple, we will use the api to authenticate user information. In our work, our users' accounts need to connect to the their twitter account. And then in our follow-up events, if they shared our event informations or ads by the connected twitter account, we will give them some little reward, these reward can be used to exchange service in our platform.

### Are you planning to analyze Twitter data?

Yes, in our work, we may need to analyze the twitter data, the main target is to analyze topics or keywords and explore specific user’s timeline of Tweets and replies.

### Will your app use Tweet, Retweet, like, follow, or Direct Message functionality?

Yes, in our work, when a user finish his share, we need to give him the rewards. The amount of reward depends on the quality of his tweet. We can do it manually, but with API our system can do it automatically.


