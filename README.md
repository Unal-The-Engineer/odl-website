# ODL MOOC Website

A modern, interactive MOOC (Massive Open Online Course) website built with React and FastAPI, designed to promote peace and understanding through educational content.

## 🌟 Features

- **Info Capsule**: Educational video content about peace and understanding
- **Fun Quiz**: Interactive millionaire-style quiz powered by Genially
- **Comic World**: Visual storytelling through a 4-page comic series
- **Progressive Learning**: Modules unlock as you complete previous ones
- **Responsive Design**: Beautiful UI that works on all devices

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons

### Backend
- **FastAPI** for high-performance API
- **Uvicorn** ASGI server
- **Python 3.11+**

## 🚀 Local Development

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd odl-website
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Run Development Servers**
   
   Terminal 1 (Backend):
   ```bash
   cd backend
   source venv/bin/activate
   python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 🥧 Raspberry Pi Deployment

### Quick Deployment

1. **Transfer files to Raspberry Pi**
   ```bash
   scp -r . pi@your-pi-ip:/home/pi/odl-website
   ```

2. **Run deployment script**
   ```bash
   ssh pi@your-pi-ip
   cd /home/pi/odl-website
   ./deploy-pi.sh
   ```

### Manual Deployment

1. **Install dependencies**
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y python3-pip python3-venv nodejs npm nginx
   ```

2. **Setup project**
   ```bash
   sudo mkdir -p /var/www/odl-website
   sudo chown $USER:$USER /var/www/odl-website
   cp -r . /var/www/odl-website/
   cd /var/www/odl-website
   ```

3. **Backend setup**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r backend/requirements.txt
   ```

4. **Frontend build**
   ```bash
   cd frontend
   npm install
   npm run build
   cd ..
   ```

5. **Create systemd service**
   ```bash
   sudo cp odl-backend.service /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable odl-backend
   sudo systemctl start odl-backend
   ```

6. **Configure Nginx**
   ```bash
   sudo cp nginx-config /etc/nginx/sites-available/odl-website
   sudo ln -s /etc/nginx/sites-available/odl-website /etc/nginx/sites-enabled/
   sudo systemctl restart nginx
   ```

## ☁️ Cloudflare Tunnel Setup

### Prerequisites
- Domain name added to Cloudflare
- Cloudflare account with Zero Trust access

### Setup Steps

1. **Run setup script**
   ```bash
   ./setup-cloudflare-tunnel.sh
   ```

2. **Create tunnel in Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com/
   - Navigate to Zero Trust > Access > Tunnels
   - Create a new tunnel
   - Copy the tunnel token

3. **Install tunnel service**
   ```bash
   sudo cloudflared service install YOUR_TUNNEL_TOKEN
   ```

4. **Configure tunnel**
   - Edit `/etc/cloudflared/config.yml`
   - Replace `YOUR_TUNNEL_ID` and `yourdomain.com` with your values

5. **Start tunnel**
   ```bash
   sudo systemctl start cloudflared
   sudo systemctl enable cloudflared
   ```

## 📁 Project Structure

```
odl-website/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── static/
│       ├── videos/          # Video files
│       └── comics/          # Comic images
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React context
│   │   └── styles/          # CSS files
│   ├── package.json         # Node.js dependencies
│   └── dist/               # Built files (after npm run build)
├── deploy-pi.sh            # Raspberry Pi deployment script
├── setup-cloudflare-tunnel.sh  # Cloudflare tunnel setup
└── README.md               # This file
```

## 🔧 Useful Commands

### Development
```bash
# Backend logs
cd backend && python -m uvicorn main:app --reload --log-level debug

# Frontend with network access
cd frontend && npm run dev -- --host

# Build frontend for production
cd frontend && npm run build
```

### Production (Raspberry Pi)
```bash
# Check service status
sudo systemctl status odl-backend
sudo systemctl status nginx
sudo systemctl status cloudflared

# View logs
sudo journalctl -u odl-backend -f
sudo tail -f /var/log/nginx/error.log

# Restart services
sudo systemctl restart odl-backend
sudo systemctl restart nginx
```

## 🌐 Access URLs

- **Local Development**: http://localhost:5173
- **Raspberry Pi Local**: http://pi-ip-address
- **Public (via Cloudflare)**: https://yourdomain.com

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues and questions, please open an issue in the repository. 