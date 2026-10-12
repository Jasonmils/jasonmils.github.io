---
title: Bayesian Regression
date: 2022-05-13 10:18
last_modified_at: 2022-05-14 01:08:25 +0800
tags: [Machine Learning, Statistic, Bayesian]
math: true
toc:  true
---
This is an brief introduction to the bayesian regression (Chinese).
{: .message }

# 1. 朴素贝叶斯算法
朴素贝叶斯算法是学习数据集的联合概率分布 \\\(P(X,Y)\\\)，而这个过程是通过学习先验概率 \\\(P(Y=C_k)\\\) 和条件概率分布 \\\(P(X=x|Y=C_k)\\\) 完成的。
## 1.1 定义一个数据集实例
定义一个数据集 \\\(T\\\) 为 :

$$
T=\{ (x_1,y_1),(x_2,y_2),\cdots,(x_N,y_N)  \}
$$

其中 \\\(x_i=(x_i^{(1)},x_i^{(2)},\cdots,x_i^{(n)}), x_i^{(j)}\in\{a_{j1},a_{j2},\cdots,a_{jS_j}\}\\\).
\\\(x_i^{(j)}\\\) 为第 \\\(i\\\) 个样本的第 \\\(j\\\) 个 feature，\\\(a_{jS_j}\\\) 为第 \\\(j\\\) 个 feature 可能取的第\\\(S_j\\\)个值, \\\(j=1,2,\cdots,n\\\).\\\(y_i \in \{C_1,C_2,\cdots,C_k\}\\\)
- *概括描述该数据集*

|内容描述|数值 |典型符号|
|--|-- |--|
|数据集有N个样本标签|N|\\\(y_N\\\), \\\(x_N\\\)|
|数据集每一个x样本中对应有n个features|n|\\\(x_i^{(n)}\\\)|
|数据集的标签有K类，分别为 \\\(C_1,C_2,\cdots,C_k\\\)|k|\\\(C_k\\\)|
|每个特征 \\\(x_i^{(j)}\\\) 有 \\\(S_j\\\) 个可能的取值|\\\(S_j\\\)|\\\(a_{jS_j}\\\)|

## 1.2 朴素贝叶斯算法步骤
1. 计算**先验概率** \\\(P\left(Y=C_{k}\right)\\\) : 得到训练集中每一类 \\\(C_k\\\) 的概率.
$$ P\left(Y=C_{k}\right)=\frac{\sum_{i=1}^{N} I\left(y_{i}=C_{k}\right)}{N}, \quad k=1,2, \cdots, K $$
2. 计算条件概率 \\\(P\left(X^{(j)}=a_{j l} \mid Y=c_{k}\right)\\\)
$$ P\left(X^{(j)}=a_{j l} \mid Y=C_{k}\right)=\frac{\sum_{i=1}^{N} I\left(x_{i}^{(j)}=a_{j l}, y_{i}=c_{k}\right)}{\sum_{i=1}^{N} I\left(y_{i}=c_{k}\right)} \ \ , j=1,2, \cdots, n ; \quad l=1,2, \cdots, S_{j} ; \quad k=1,2, \cdots, K$$
3. 对于给定的实例 \\\(x=(x^{(1)}, x^{(2)}, \cdots, x^{(n)})^T\\\), 利用**贝叶斯定理**计算其**后验概率** \\\(P\left(Y=C_{k} \mid X^{(j)}= x^{(j)}\right)\\\):
$$\begin{aligned} 
P\left(Y=C_{k} \mid X^{(j)} =  x^{(j)}\right) &=\frac{P\left(X^{(j)}= x^{(j)} \mid Y=C_{k}\right) P\left(Y=C_{k}\right)}{\sum_{k} P\left(X^{(j)}= x^{(j)} \mid Y=C_{k}\right) P\left(Y=C_{k}\right)}  \\
&= \frac{P\left(Y=C_{k}\right) \prod_{j} P\left(X^{(j)}=x^{(j)} \mid Y=c_{k}\right)}{\sum_{k} P\left(Y=c_{k}\right) \prod_{j} P\left(X^{(j)}=x^{(j)} \mid Y=c_{k}\right)}, \quad k=1,2, \cdots, K 
\end{aligned} $$
> - ***补充知识*** -- **贝叶斯定理**：
> $$P(Y \mid X)=\frac{P(X, Y)}{P(X)}=\frac{P(Y) P(X \mid Y)}{\sum_{Y} P(Y) P(X \mid Y)}$$
> 利用条件概率和先验概率计算 $P(Y \mid X)$

> 由于上述公式的分母对于任意 k，均相等，那么只需要比较分子的大小，即可得到后验概率最大的类别，便可以判断出实例  $x=(x^{(1)}, x^{(2)}, \cdots, x^{(n)})^T$ 对应的分类是什么。
> - **朴素贝叶斯之所以被称为朴素，是因为输入X的强独立性假设**

因此，仅需计算分子部分，及计算下面公式，并且比较大小：
$$P\left(Y=C_{k}\right) \prod_{j=1}^{n} P\left(X^{(j)}=x^{(j)} \mid Y=C_{k}\right), \quad k=1,2, \cdots, K$$
4. 最后我们确定实例 \\\(x=(x^{(1)}, x^{(2)}, \cdots, x^{(n)})^T\\\) 对应的分类：
$$y=\arg \max _{C_{k}} P\left(Y=C_{k}\right) \prod_{j=1}^{n} P\left(X^{(j)}=x^{(j)} \mid Y=C_{k}\right)$$

# 2. 贝叶斯估计
在朴素贝叶斯中（极大似然估计），估计的概率可能会出现0的情况，而这会影响**后验概率**的计算（1.2 朴素贝叶斯算法步骤 - 4) 因此我们需要加上Laplace 平滑使得概率大于0，从而使得连乘不至于=0.
## 2.1 Laplace smoothing 拉普拉斯平滑
在朴素贝叶斯的基础上，我们在分子分母都加上一个与 \\\(\lambda\\\) 相关的正系数，其中 \\\(\lambda >0\\\). 当 \\\(\lambda =0\\\) 则为极大似然估计。当 \\\(\lambda =1\\\)时，为拉普拉斯平滑。
$$ P_{\lambda}\left(X^{(j)}=a_{j l} \mid Y=c_{k}\right)=\frac{\sum_{i=1}^{N} I\left(x_{i}^{(j)}=a_{j l}, y_{i}=C_{k}\right)+\lambda}{\sum_{i=1}^{N} I\left(y_{i}=C_{k}\right)+S_{j} \lambda}$$
此时，先验概率变为：
$$P_{\lambda}\left(Y=C_{k}\right)=\frac{\sum_{i=1}^{N} I\left(y_{i}=C_{k}\right)+\lambda}{N+K \lambda}$$
> 可以看到，当 \\\(\lambda =1\\\) 时，相当于在N个样本的基础上增加了K个样本，并且这K个样本涵盖了每一个类别。
>  - **其实平滑过程相当于对原始数据集进行一个人为添加噪声的过程， \\\(\lambda\\\) 越大，可能精度越低**
>  - **朴素贝叶斯假设输入变量都是条件独立的，如果他们之间存在概率依存关系，则模型变成了贝叶斯网络**。

# 3. 朴素贝叶斯的代码实现 [Python]
利用 sklearn 对 Iris dataset 进行一个测试 
``` python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import BernoulliNB

​# 加载数据
iris = load_iris()
iris.data.shape  # (150, 4)

x = iris.data[:, :-1]
y = iris.target

# 对数据集进行切分
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=666)
"""
使用sklearn库实现朴素贝叶斯
"""
Classify = BernoulliNB(alpha=1)
Classify.fit(x_train,y_train)
"""
查看模型的准确率
"""
print("The training accuracy of Naive Bayesian is :",Classify.score(x_train,y_train))
print("The classifying accuracy of Naive Bayesian is :",Classify.score(x_test,y_test))
```

```python
[Results]:
The training accuracy of Naive Bayesian is : 0.35
The classifying accuracy of Naive Bayesian is : 0.26666666666666666
```

>  可见朴素贝叶斯的分类的准确度并不是很高，需要进一步提升，因为Iris 数据集的标签为 0，1，2，3. 则我们想到可以改变 朴素贝叶斯的二值化阈值 （Binarize）来提升性能。
> - *Sklearn 中的解释为*
> **binarizefloat or None, default=0.0**
Threshold for binarizing (mapping to booleans) of sample features. If None, input is presumed to already consist of binary vectors. 

通过改变 Binarize 的值，其精确度分布为：![在这里插入图片描述](https://img-blog.csdnimg.cn/37026b46b3e643d9bd275e172580abf4.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBASmFzb25EZWFu,size_15,color_FFFFFF,t_70,g_se,x_16#pic_center)
可以看到，当以2.5~3之间的数字作为输入 X 的二值化阈值时，此时分类的精确度最高

除了改变参数，把模型换成 高斯朴素贝叶斯（GaussianNB）和多项式贝叶斯（MultinomialNB）试试

```python
gaussian_clf = GaussianNB()
multinomial_clf = MultinomialNB()

gaussian_clf.fit(x_train, y_train)
multinomial_clf.fit(x_train, y_train)

print("The training accuracy of Gaussian is :",gaussian_clf.score(x_test,y_test))
print("The training accuracy of Multinomial is :",multinomial_clf.score(x_test,y_test))
```


```python
[Results]:
The training accuracy of Gaussian is : 0.9666666666666667
The training accuracy of Multinomial is : 0.7666666666666667
```

## 总结
> 可以看到 高斯朴素贝叶斯（GaussianNB）和多项式贝叶斯（MultinomialNB）效果均比 Naive Bayesian 好, 其原因可能为：
>  - 高斯朴素贝叶斯（GaussianNB）： 适用于处理连续型变量，因此精度可能更高
>  - 多项式贝叶斯（MultinomialNB）： 适用于处理离散型变量
> - 朴素贝叶斯:  适合处理布尔类型的二进制变量（离散）