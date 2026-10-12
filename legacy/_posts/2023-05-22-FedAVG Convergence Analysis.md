---
title: Convergence Analysis of the Federated Learning
date: 2023-05-31 10:18 +0800
last_modified_at: 2023-06-22 01:08:25 +0800
tags: [federated learning, deep learning,convergence]
math: true
toc:  true
---
A specific inference concerning the convergence of Federated learning.
{: .message }

# Introduction
This is a note to record the inference steps of the FedAvg convergence.
Similar to Model concergence analysis we conduct convergence anlysis in FedAVG, and it is originated from [[Wang 等。 - 2021 - A Field Guide to Federated Optimization.pdf]] .

# Model convergence Assumptions and Preliminaries
1. **Local update SGD:** $$x_i$$ is the local model parameter for client $i$. t: global round index; k: local step index
$$
x_i^{(t,k+1)}:= x_i^{(t,k)}-\eta\frac{\partial \mathcal{L}}{\partial x_i^{(t,k)}}  = x_i^{(t,k)}-\eta\nabla x_i^{(t,k)}
$$

2. **Overall optimization objective:** We have client population as $\mathcal{C} = \{1,2,3,\cdots,M\}$ the objective is 
$$
\min F(x)=\mathbb{E}_{i\sim\mathcal{C}}(F_i(x))
$$

## Properties of local objectives
1. **Each local objective** $F_i(x)$ is convex abnd L-smooth. **Each client** can query an *unbiased stochastic gradient* with *σ2-uniformly bounded variance* in L2 norm.
2. **Poperty1: Unbiased stocahstic gradient**: expectation of the stochastic gradient for a given $x_i^{(t,k)}$ is equal to the averaged local gradient for a given model $\phi(\cdot)$ *This is to say, the gradient expectation of the SGD equals to the gradient of the GD* (**Unbiased stochastic gradient**)[[Stochastic Gradient Descent vs Gradient Descent]]
$$
\mathbb{E}[\nabla x_i^{(t,k)}|x_i^{(t,k)}]=\nabla F_i(x_i^{(t,k)})
$$Given a dataset of $D_i = \{(\mathcal{x}_i,\mathcal{y}_i)\}_{i=0}^N$ , where the N denotes the length of the whole dataset. The objective of the GD and its gradients are calculated as:

$$
\begin{align}
			F_i(x_i^{(t,k)}) = \frac{1}{N}\sum_{i=1}^{N}\mathcal{L}(\phi(\mathcal{x}_i),\mathcal{y}_i) \\
			\nabla F_i(x_i^{(t,k)}) =\frac{1}{N}\sum_{i=1}^{N}\nabla\mathcal{L}(\phi(\mathcal{x}_i),\mathcal{y}_i) 
			\end{align}
$$

In this case, the expectation is the **weighted average of a single batch** with `batchsize` as *bn*, i.e., 

$$
			\begin{align}
	\mathbb{E}\left[\nabla x_i^{(t,k)}|x_i^{(t,k)}\right] &= \sum^{N-bn+1}_{j=1} \left(\sum_{i=1}^{bn}{\frac{\partial \mathcal{L}}{\partial x_{i,s_j}^{(t,k)}}}\cdot P(I=i|S=s_j)\right)\cdot P(S=s_j) \\
	&= \sum^{N-bn+1}_{j=1} \left( P(I=i|S=s_j)P(S=s_j)\sum_{i=1}^{bn}{\frac{\partial \mathcal{L}}{\partial x_{i,s_j}^{(t,k)}}} \right)\\
	& = \frac{1}{N}\sum_{i=1}^N{\frac{\partial \mathcal{L}}{\partial x_{i}^{(t,k)}}}\\
	&= \frac{1}{N}\sum_{i=1}^{N}\nabla\mathcal{L}(\phi(\mathcal{x}_i),\mathcal{y}_i) \\
	& = \nabla F_i(x_i^{(t,k)})
	\end{align} \tag{1}
$$ 
	where batch set is $S = \{s_1,\cdots,s_{bn}\}$.**Note:** *SGD* or *Adam* is a stochastic optimzation algorithm that select the samples from the batch randomly for gradient calculation.

3. **Property 2: Bounded variance**: 
$$
\mathbb{E}\left[\left\Vert\nabla x_i^{(t,k)}-\nabla F_i(x_i^{(t,k)})\right\Vert^2|x_i^{(t,k)}\right] \leq \sigma^2
$$ 
*This is to say, the gradient of the SGD is close to the gradient of the GD*

## Data heterogeneity/similarity across clients
Local gradient $\nabla F_i(x)$ and global gradient $\nabla F(x)$ is $\zeta$ - uniformly bounded.  
$$
\max_l{\sup_x{\left\Vert \nabla F_i(x_i^{(t,k)})-\nabla F(x_i^{(t,k)})\right\Vert}} \leq \zeta
$$

---

## How do we measure the convergence of the FedAVG?
Generally, we want to prove that 
$$\|F(x^{(t,k+1)})-F(x^*)\|\leq\|F(x^{(t,k)})-F(x^*)\| , \forall t,k \in [1,2,3,\cdots]$$
where $F(x^*)$ is the optimal. Or, we give a weaker claim:
$$\mathbb{E}\left[\frac{1}{\tau T} \sum_{t=0}^{T-1} \sum_{k=1}^\tau F\left(\overline{\boldsymbol{x}}^{(t, k)}\right)-F\left(\boldsymbol{x}^{\star}\right)\right] \leq \text{ an upper bound decreasing with } T \text {. }$$ 

Note that $\mathbb{E}$ in this paper denotes $\mathbb{E}_{i\sim \mathcal{C}}$ , where $\mathcal{C}$ denotes the client set. Therefore, we can say that the $\mathbb{E}$ is *generally calculating the expectation over all the clients*.

**Decentralized optimization**:
Originated from the decentralized optimization, we derive the *shadow sequence* to indicate the uodate process.

$$
\overline{x}^{(t,k)}:=\frac{1}{M}\sum^{M}_{i=1}{x_i^{(t,k)}}
$$
Then, at round $t$ local epoch $k+1$, 
$$\overline{x}^{(t,k+1)}= \overline{x}^{(t,k)}-\eta \frac{1}{M}\sum^{M}_{i=1}{x_i^{(t,k)}}$$ 

### Two lemmas to facilitate the convergence proof
This paper want to prove the **Theorem** as follows. 
$$\mathbb{E}\left[\frac{1}{\tau T} \sum_{t=0}^{T-1} \sum_{k=1}^\tau F\left(\overline{\boldsymbol{x}}^{(t, k)}\right)-F\left(\boldsymbol{x}^{\star}\right)\right] \leq \text { an upper bound decreasing with } T \text {. }$$

**Lemma1** the paper proves that the expectation for each round is bounded.
$$\mathbb{E}\left[\frac{1}{\tau}  \sum_{k=1}^\tau F\left(\overline{\boldsymbol{x}}^{(t, k)}\right)-F\left(\boldsymbol{x}^{\star}\right)\bigg|\mathcal{F}^{(t,0)}\right] \leq Bound$$

**Lemma2** the paper proves that the *Bound* in the lemma 1 is decreasing with T.
Specific prove is available in [Paper]("C:\Users\jason\Zotero\storage\C4RSHTSA\Wang 等。 - 2021 - A Field Guide to Federated Optimization.pdf")

## Why this paper evaluate the expection instead of loss decrease in each step?
Our guess is that each-step loss may not decrease with T, but its expectation is bounded. Lets prove it in the following paragraphs.
### Prove of the step-by-step decrease in loss function
We want to prove the Theorem that 
$$\|F(x^{(t,k+1)})-F(x^*)\|\leq\|F(x^{(t,k)})-F(x^*)\| , \forall t,k \in [1,2,3,\cdots]$$
 we spilt into two therom


