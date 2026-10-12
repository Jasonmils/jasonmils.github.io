---
title: Difference between Transductive and Inductive Learning
date: 2023-05-31 10:18
last_modified_at: 2023-05-31 01:08:25 +0800
tags: 
    - Transductive
    - Inductive
    - learning
math: true
---

> 通俗来说：课后作业里留了期中考试原题的是transductive learning,不留的是inductive learning,而且都不给答案。所以有原题的学生成绩更好

Inductive learning and transductive learning are two different approaches to machine learning that are used to make predictions on data. They are applied in different application
- **Inductive**: Most typical, can be applied in most of the tasks.
- **Transductive**: when the data amout is not enough.

## Inductive learning (Typical, no future involved)
Inductive learning is a type of supervised learning where the algorithm is trained on a subset of the data to make predictions on unseen data. The goal of inductive learning is to learn a general rule or pattern that can be applied to new examples. In other words, inductive learning involves learning from a representative set of examples in order to generalize to new, unseen examples.
**Training set:** 
$$\{X_{train},Y_{train}\}$$
**Test set:**
$$\{X_{test},Y_{test}\}$$
## Transductive learning
Transductive learning, on the other hand, is a type of semi-supervised learning where the algorithm makes predictions on specific examples in the unlabeled data based on the information available within the labeled data. The goal of transductive learning is to use the relationships between the labeled and unlabeled data to improve the accuracy of predictions on the unlabeled data. In other words, transductive learning involves making predictions on specific examples based on the information available in the labeled data.
**Training set:** 
$$\{X_{train},Y_{train},X_{test}\}$$
**Test set:**
$$\{X_{test},Y_{test}\}$$

*Note that it might not be appropreiate to apply this in an autoregressive task.* IF you need day-ahead operation, this might not be availble.
## Example
To illustrate the difference between inductive and transductive learning, consider the example of predicting the weather. 
- Inductive learning would involve training a model on historical weather data to make predictions about future weather conditions. 
- Transductive learning, on the other hand, would involve making predictions about the weather at specific locations based on the current weather conditions and the relationships between nearby locations.

## Summary
In general, inductive learning is more widely used than transductive learning because it is easier to apply to a wide variety of problems and can be used with large datasets. However, transductive learning can be useful in situations where there is a limited amount of labeled data available and the goal is to make predictions on specific examples within the unlabeled data.