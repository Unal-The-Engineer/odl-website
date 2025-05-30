#!/bin/bash

# Cloudflare Tunnel Setup Script for Raspberry Pi
echo "☁️ Setting up Cloudflare Tunnel..."

# Check if cloudflared is installed
if ! command -v cloudflared &> /dev/null; then
    echo "📦 Installing cloudflared..."
    
    # Download and install cloudflared for ARM64 (Raspberry Pi 4)
    wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb
    sudo dpkg -i cloudflared-linux-arm64.deb
    rm cloudflared-linux-arm64.deb
fi

echo "🔐 Please follow these steps:"
echo ""
echo "1. Go to https://dash.cloudflare.com/"
echo "2. Add your domain to Cloudflare (if not already added)"
echo "3. Go to Zero Trust > Access > Tunnels"
echo "4. Create a new tunnel"
echo "5. Copy the tunnel token when prompted"
echo ""
echo "After getting your tunnel token, run:"
echo "sudo cloudflared service install YOUR_TUNNEL_TOKEN"
echo ""
echo "Then create tunnel configuration:"

# Create tunnel config template
sudo mkdir -p /etc/cloudflared
sudo tee /etc/cloudflared/config.yml > /dev/null <<EOF
# Cloudflare Tunnel Configuration
# Replace YOUR_TUNNEL_ID with your actual tunnel ID

tunnel: YOUR_TUNNEL_ID
credentials-file: /etc/cloudflared/YOUR_TUNNEL_ID.json

ingress:
  # Route your domain to local service
  - hostname: yourdomain.com
    service: http://localhost:80
  
  # Catch-all rule (required)
  - service: http_status:404

EOF

echo "📝 Configuration template created at /etc/cloudflared/config.yml"
echo ""
echo "🔧 After setting up your tunnel:"
echo "1. Edit /etc/cloudflared/config.yml with your tunnel ID and domain"
echo "2. Start the tunnel: sudo systemctl start cloudflared"
echo "3. Enable auto-start: sudo systemctl enable cloudflared"
echo ""
echo "✅ Your website will be available at: https://yourdomain.com" 