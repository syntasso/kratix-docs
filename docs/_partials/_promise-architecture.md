```mdx-code-block
import PromiseDiagram from "/img/docs/workshop/promise-diagram.svg"
```

<figure className="diagram">
  <PromiseDiagram className="medium"/>

  <figcaption>A Promise in details</figcaption>
</figure>

At a very high-level, a Promise is made up of four parts:

1. **The Promise API:** The Promise API is what the users of the Platform will
   interact with when requesting a new Resource from the Promised Service
2. **The Imperative Workflow:** A series of steps where Platform teams can
   codify all of their business requirements.
3. **The Declarative State:** The Workflow executes a series of *imperative*
   steps to generate a *declarative state* that is then persisted to the State
   Store. Other systems will then *converge* on that state.
4. **The Dependencies**: A dependency is anything that must be installed or made
   available on Destinations to enable the promised service to run.
