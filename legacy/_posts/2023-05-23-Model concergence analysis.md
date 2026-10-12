---
title: Model Convergence Analysis
date: 2023-05-31 10:18 +0800
last_modified_at: 2023-05-31 01:08:25 +0800
tags: [Convergence]
math: true
toc:  true
---
A specific inference concerning the convergence of Federated learning.
{: .message }

# Optimization objective

$$x^*=\min f(x), \quad s.t. \Vert x\Vert$$

# General convergence analysis
Given the constraint is not convex, it might be hard to address this problem directly.
## Convex and smooth function without constraints
Define the loss function as *L-smooth:*

$$\Vert\nabla f(x)-\nabla f(y)\Vert\leq L\Vert x-y\Vert^2$$

Then, we can infer the following Property. ([[Difference about lemmas, theorem, proposition, corollary]])
### Property 1 Inferred from L-smooth:

$$f(x)-f(y) \leq \nabla f(x)^{\top}(x-y)-\frac{1}{2 L}\|\nabla f(x)-\nabla f(y)\|^2$$

### Convergence Analysis of the L-smooth convex optimization problem
The main target of convergence analysis is to prove $x^{t+1}$ is closer to the optimal $x^*$ than $x^t$. 
Thus, we can use Eucidean distance in gradient descent optimization solver to measure the proximity as: 

$$\begin{aligned}
\left\|x^{t+1}-x^*\right\|^2&=\left\|x^t-\eta \nabla f\left(x^t\right)-x^*\right\|^2 \\
&=\left\|x^t-x^*\right\|^2-2 \eta \nabla f\left(x^t\right)^{\top}\left(x^t-x^*\right)+\eta^2\left\|\nabla f\left(x^t\right)\right\|^2
\end{aligned}$$

### Prove the convergence
We can infer that 
$$0\leq f(x^t)-f(x^*)\leq \nabla f(x^t)^{\top}(x^t-x^*)-\frac{1}{2 L}\|\nabla f(x^t)-\nabla f(x^**)\|^2$$ 
Then: 
$$\nabla f(x^t)^{\top}(x^t-x^*)\geq\frac{1}{2 L}\|\nabla f(x^t)-\nabla f(x^**)\|^2$$

From ![[Model concergence analysis#^a1itzw]]we can obtain 
$$\begin{aligned}
\left\|x^{t+1}-x^*\right\|^2
&=\left\|x^t-x^*\right\|^2-2 \eta \nabla f\left(x^t\right)^{\top}\left(x^t-x^*\right)+\eta^2\left\|\nabla f\left(x^t\right)\right\|^2 \\
&\leq \Vert x^t-x^*\Vert^2 -\frac{\eta}{L}\Vert\nabla f(x^t)\Vert^2+\eta^2\left\|\nabla f\left(x^t\right)\right\|^2\\
& = \Vert x^t-x^*\Vert^2 -\eta\left(\frac{1}{L}-\eta\right)\left\|\nabla f\left(x^t\right)\right\|^2
\end{aligned}$$ 

Therefore, if the $\frac{1}{L}> \eta$ , we can safely assert that 
$$\left\|x^{t+1}-x^*\right\|^2
\leq\left\|x^t-x^*\right\|^2$$

which proves the **convergence**.

>This is a convex optimization with no constraint case. More detail about the other cases is avaible at [Convergence Analysis - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/412118471)


>Also, the convergence rate analysis is not included, including the O,Omega and Pi analysis are  out of scope in this blog. However, it should be specified in the future blogs.



