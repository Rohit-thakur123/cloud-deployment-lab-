# Cloud Deployment Lab

A beginner-friendly Express and EJS web application for practicing a delivery workflow with GitHub, Docker, and AWS EC2. The home page shows the application status, student name, version, and deployment stack. The same application runs locally or in a container.

## Objectives

- Build a server-rendered web application with Node.js, Express, and EJS.
- Package the app in a Docker image and verify it locally.
- Publish the source to GitHub and deploy the container to an Ubuntu EC2 instance.

## Technology Stack

- Node.js 22, Express, and EJS
- HTML5 and responsive CSS
- Git and GitHub
- Docker and Ubuntu on AWS EC2

## Project Structure

```text
cloud-deployment-lab/
├── app.js
├── package.json
├── package-lock.json
├── Dockerfile
├── .dockerignore
├── .gitignore
├── README.md
├── views/
│   └── index.ejs
└── public/
    └── style.css
```

## Prerequisites

- Node.js 22 or newer and npm
- Git
- Docker Desktop (Windows/macOS) or Docker Engine (Linux)
- For deployment: an AWS account, an Ubuntu EC2 instance, and an SSH key pair stored securely on your computer

No AWS resource is created by this project. Review AWS pricing and stop or terminate resources when the lab is complete.

## Run Locally

From the project directory:

```sh
npm install
npm start
```

Open `http://localhost:3000`. Stop the server with `Ctrl+C`.

Defaults are `STUDENT_NAME=Rohit Singh`, `APP_VERSION=1.0.0`, and `PORT=3000`. For example, to run a customized instance on port 3001 in PowerShell:

```powershell
$env:STUDENT_NAME = "Rohit Singh"
$env:APP_VERSION = "1.0.1"
$env:PORT = "3001"
npm start
```

On macOS/Linux, use `STUDENT_NAME="Rohit Singh" APP_VERSION=1.0.1 PORT=3001 npm start`.

## Verify the Application

Visit `http://localhost:3000/health` or run:

```sh
curl http://localhost:3000/health
```

Expected response (the version follows `APP_VERSION`):

```json
{ "status": "ok", "version": "1.0.0" }
```

## Build and Run with Docker

Make sure Docker Desktop or Docker Engine is running, then run these commands from the project directory:

```sh
docker build -t cloud-deployment-lab .
docker run -d --name cloud-lab -p 3000:3000 cloud-deployment-lab
docker ps
```

Open `http://localhost:3000` and test `http://localhost:3000/health`. Review logs and clean up with:

```sh
docker logs cloud-lab
docker stop cloud-lab
docker rm cloud-lab
```

If the container name is already in use, stop and remove the old container before running `docker run` again. Add options such as `-e STUDENT_NAME="Rohit Singh" -e APP_VERSION=1.0.1` before the image name to override defaults.

## Publish to GitHub

1. Create an empty repository named `cloud-deployment-lab` on GitHub. Do not initialize it with a README, license, or `.gitignore` because this project includes them.
2. In a terminal opened in this project directory, initialize and push the project. Replace the URL with the HTTPS or SSH URL shown by GitHub:

```sh
git init
git add app.js package.json package-lock.json Dockerfile .dockerignore .gitignore README.md views public
git commit -m "Create Cloud Deployment Lab application"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/cloud-deployment-lab.git
git push -u origin main
```

Keep the resulting repository URL for submission. Never commit passwords, access tokens, `.env` files containing secrets, or private SSH keys.

## Deploy to AWS EC2

These steps create AWS resources and may incur charges. Review instance and storage pricing first; no resources are launched automatically by this project.

1. Launch an Ubuntu LTS EC2 instance and create or select a key pair. Store the downloaded private key securely; do not put it in this repository.
2. In the instance security group, allow inbound SSH (TCP 22) only from your current IP. Add inbound Custom TCP port `3000`; use `0.0.0.0/0` only when the demonstration must be publicly reachable, then remove that rule after the lab. Leave outbound traffic enabled for package installation and GitHub access.
3. Connect from your computer, replacing the key path and public IP:

```sh
chmod 400 /path/to/your-key.pem
ssh -i /path/to/your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

On Windows PowerShell, use your Windows key path in the `ssh` command. If OpenSSH rejects the key permissions, restrict the key ACL to your Windows user before reconnecting.

4. On the EC2 instance, install Docker and Git, enable Docker, and grant the `ubuntu` user Docker access. Log out and reconnect after adding group membership:

```sh
sudo apt update
sudo apt install -y docker.io git
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"
exit
```

5. Reconnect with SSH, clone the repository, then build and run the app:

```sh
git clone https://github.com/YOUR_GITHUB_USERNAME/cloud-deployment-lab.git
cd cloud-deployment-lab
docker build -t cloud-deployment-lab .
docker run -d --restart unless-stopped --name cloud-lab -p 3000:3000 cloud-deployment-lab
docker ps
docker logs cloud-lab
```

6. Open `http://YOUR_EC2_PUBLIC_IP:3000` in a browser. Verify the API at `http://YOUR_EC2_PUBLIC_IP:3000/health`. Do not hardcode the IP in source; it can change when the instance is stopped and started unless an Elastic IP is assigned.

## Troubleshooting

- **Port 3000 is already in use:** stop the process/container using it, or run locally on another port (`$env:PORT="3001"` in PowerShell, or `PORT=3001 npm start` on macOS/Linux). Docker can map a different host port using `-p 3001:3000`, then browse to port 3001.
- **Docker Desktop is not running:** start Docker Desktop and wait until its engine is ready, then retry `docker build`.
- **Docker image build fails:** confirm Docker is running, the terminal is in the project root, and both package files are present. Retry with `docker build --no-cache -t cloud-deployment-lab .` if a stale build cache is suspected.
- **Container exits unexpectedly:** inspect `docker ps -a` and `docker logs cloud-lab`. Fix the reported startup/configuration issue, remove the stopped container, and run it again.
- **GitHub repository cannot be cloned:** check the URL, repository visibility, network access, and authentication. For a private repository, configure GitHub authentication on EC2 without putting credentials in source files.
- **EC2 public IP does not load:** confirm `docker ps` shows the container, `docker logs cloud-lab` has no startup error, the instance is running, and the URL includes `:3000` and uses HTTP.
- **Security group inbound rules are incorrect:** allow TCP 3000 from the intended clients and SSH TCP 22 from your own IP only. Check the instance's assigned security group and subnet/network ACL rules.
- **Docker permission denied on EC2:** reconnect after `sudo usermod -aG docker "$USER"`; alternatively prefix Docker commands with `sudo`.

Useful container commands:

```sh
docker ps
docker logs cloud-lab
docker stop cloud-lab
docker rm cloud-lab
```

## Screenshot Checklist

- Local home page showing the student name and version.
- Terminal showing the running Docker container in `docker ps`.
- Application loaded from the EC2 public IPv4 address on port 3000.

Capture these screenshots from your own running environments and include them in the submission. No screenshots or deployment evidence are included until captured.

## Security Considerations

- Restrict SSH ingress to your IP; do not expose port 22 to everyone.
- Expose port 3000 only for the duration and audience of the lab demonstration.
- Never commit secrets, `.env` files containing secrets, or private key files. Ignore files exclude common secret and key patterns.
- The Docker socket grants powerful host access. Use Docker only with trusted images and source code.
- Stop or terminate EC2 resources and remove temporary inbound rules when finished to reduce exposure and avoid ongoing charges.
