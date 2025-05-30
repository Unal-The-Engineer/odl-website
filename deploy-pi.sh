#!/bin/bash

# ODL Website Raspberry Pi Deployment Script
echo "🚀 Starting ODL Website deployment on Raspberry Pi..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required packages
echo "🔧 Installing required packages..."
sudo apt install -y python3-pip python3-venv nodejs npm nginx

# Create project directory
PROJECT_DIR="/var/www/odl-website"
echo "📁 Creating project directory: $PROJECT_DIR"
sudo mkdir -p $PROJECT_DIR
sudo chown $USER:$USER $PROJECT_DIR

# Copy project files (assuming you're running this from the project directory)
echo "📋 Copying project files..."
cp -r . $PROJECT_DIR/
cd $PROJECT_DIR

# Setup Python virtual environment
echo "🐍 Setting up Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r backend/requirements.txt

# Install Node.js dependencies and build frontend
echo "⚛️ Installing Node.js dependencies and building frontend..."
cd frontend
npm install
npm run build
cd ..

# Create systemd service for backend
echo "🔧 Creating systemd service for backend..."
sudo tee /etc/systemd/system/odl-backend.service > /dev/null <<EOF
[Unit]
Description=ODL Website Backend
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$PROJECT_DIR
Environment=PATH=$PROJECT_DIR/venv/bin
ExecStart=$PROJECT_DIR/venv/bin/uvicorn backend.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Configure Nginx
echo "🌐 Configuring Nginx..."
sudo tee /etc/nginx/sites-available/odl-website > /dev/null <<EOF
server {
    listen 80;
    server_name localhost;

    # Frontend (built files)
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # API routes
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable Nginx site
sudo ln -sf /etc/nginx/sites-available/odl-website /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Start and enable services
echo "🚀 Starting services..."
sudo systemctl daemon-reload
sudo systemctl enable odl-backend
sudo systemctl start odl-backend
sudo systemctl enable nginx
sudo systemctl restart nginx

# Show status
echo "✅ Deployment complete!"
echo "📊 Service status:"
sudo systemctl status odl-backend --no-pager -l
sudo systemctl status nginx --no-pager -l

echo ""
echo "🌐 Your website should be available at:"
echo "   Local: http://localhost"
echo "   Network: http://$(hostname -I | awk '{print $1}')"
echo ""
echo "📝 Useful commands:"
echo "   Check backend logs: sudo journalctl -u odl-backend -f"
echo "   Check nginx logs: sudo tail -f /var/log/nginx/error.log"
echo "   Restart backend: sudo systemctl restart odl-backend"
echo "   Restart nginx: sudo systemctl restart nginx" 