# Interactive Workshop Prototype

## Quickstart

Note: This quickstart is not configured to connect to an EKS cluster yet, its just to show the experience. If you try to run `kubectl` commands etc. it will fail.

This quick start spins up everything in Docker and has minimal dependencies:

1. Need to have Docker and Docker Compose installed
2. ....

Clone the repository:

```
git clone https://github.com/niallthomson/interactive-workshop-prototype.git
cd interactive-workshop-prototype
```

Run Docker Compose:

```
docker-compose up -d
```

This will take several minutes, and even once it says its done there are still things starting.

Navigate to this in your browser:

```
http://localhost:8080
```

### Change Content

By default the Docker Compose setup picks up content from the `content` folder, which contains Markdown.

Edit any of the files in this directory and save it. You can then refresh the browser page and the appropriate page should be updated.