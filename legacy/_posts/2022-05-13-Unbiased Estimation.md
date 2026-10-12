---
title: Why do we call test-set as a way for unbiased estimation
date: 2022-05-13 10:18 +0800
last_modified_at: 2022-05-14 01:08:25 +0800
tags: [Deep learning, Statistic]
math: true
toc:  true
---
This is a premature thought on the unbiased estimation in target regression.
{: .message }

#   Why do we call test set as a way for unbiased estimation?
 #UnbiasedEstmator  #DeepLearning #Test-set   #GeneralizationError
  
 For Deep Learning applications, we spilt the dataset into training / validation and test sets. The test set is used for unbiased estimation of the model skills (generalization errors). 
 
A natural question then is whether or not these estimators are "good" in any sense. One measure of "good" is "unbiasedness."

##  Cases in time series forecasting with DL models with MAE as the estimator

Assume the MAE (Mean Absolute Error) estimator is

$$
\begin{aligned}
\widehat{\theta} &= \mathbb{L}_{MAE}(X_1,X_2,\cdots,X_n) \\
&= \frac{1}{n}\sum^{n}_{i=1}{|X_i-\widehat{X_i}|}
\end{aligned}
$$

where \\\((X_1,X_2,\cdots)\\\） is the test set, and the widehat version is its estimations. If its mathematical expectations of absolute errors (AE) are:

$$
E(\widehat{\theta}) = \widehat{\theta}
$$

Then, we call \\\(\widehat{\theta}\\\) is the unbiased estimator of MAE.

To prove that MAE is a unbiased estimator:

$$
\begin{aligned}
E(\widehat{\theta}) &= E(\frac{1}{n}\sum^{n}_{i=1}{|X_i-\widehat{X_i}|}) \\
& = \frac{1}{n}\sum^{n}_{i=1}{E(|X_i-\widehat{X_i}|)}\\
& = \frac{1}{n}\times n \times  \widehat{\theta} \\
& = \widehat{\theta}
\end{aligned}
$$

## Cases with MSE
MSE is also a unbiased estimator. 

$$
\begin{aligned}
\widehat{\theta} &= \mathbb{L}_{MSE}(X_1,X_2,\cdots,X_n) \\
&= \frac{1}{n}\sum^{n}_{i=1}{(X_i-\widehat{X_i})^2}
\end{aligned}
$$

$$
\begin{aligned}
E(\widehat{\theta})&= E(\frac{1}{n}\sum^{n}_{i=1}(X_i-\widehat{X_i})^2 )\\
&= \frac{1}{n} E(\sum^{n}_{i=1}(X_i-\widehat{X_i})^2) \\
&= \frac{1}{n} \sum^{n}_{i=1}E((X_i-\widehat{X_i})^2) \\
& = \widehat{\theta}
\end{aligned}
$$

# Conclusion
To say that test set is used for unbiased estimation, it is not about the dataset itself, but about the estimator and estimated object, i.e., mean value and $\mu$, respectively.

