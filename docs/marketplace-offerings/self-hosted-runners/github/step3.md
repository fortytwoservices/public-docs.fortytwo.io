# Step 3 - Testing the self hosted runner

The following is an example pipeline using the pool we just created:

```yaml
---
name: test 
on:
  workflow_dispatch:

permissions:
  contents: write
jobs:
  deploy:
    runs-on: self-hosted
    steps:
      - uses: actions/checkout@3df4ab11eba7bda6032a0b82a6bb43b11571feac # v4.0.0
      - name: Run a command
        shell: pwsh
        run: Write-Host "Hello World"
```

We can see that the pipeline is working just fine:

![](media/2023-09-15_14-19-38.png)

That's it, you now have an agent pool in Github, that will automatically be updated whenever the Microsoft Hosted Runners are updated (through our image). Have fun!
