# Q&A

## Reinforcement Learning / MDP

**Q: True or false: For the optimal policy of a well-defined Markov Decision Process, a fixed action is always selected for each state.**

**A: False.**

In general MDPs, optimal policies can be *stochastic* — they may assign a probability distribution over actions rather than selecting one fixed action per state. Under common additional assumptions (finite state/action spaces, discounted cumulative reward with discount factor γ ∈ [0, 1)), it can be shown that at least one *deterministic* optimal policy always exists. However, saying a fixed action is *always* selected for each state is not guaranteed without specifying those conditions, and in partially observable or average-reward settings stochastic policies may be strictly necessary.
