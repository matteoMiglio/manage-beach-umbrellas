# Getting Started 

## Run the frontend

Within the project folder, exec the following commands:

```bash
npm install

# build the component
npm run build
sudo cp -r build/* /var/www/react/html

systemctl restart nginx
```