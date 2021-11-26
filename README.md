# Microservice Store

![ACME MicroService Merch Store](https://user-images.githubusercontent.com/7496187/143560618-fac1750c-658b-427a-84b6-61e174706712.png)

## Demo Site
https://acme-merch.com/

## Install
- Download the `_resources/docker-compose.yml` file from the repo
- Place the file on your server
- Run `docker-compose up`
- Open up a browser and go to http://127.0.0.1:9090

To setup the CMS:
- Open up a browser and go to http://127.0.0.1:9090/cms
- Follow the account creation setup
- Go to Settings->Integrations->Add custom integration
- Give the integration a name
- Copy the `Content API key`
- Copy the `.env-local` to `.env`
- Update the `GHOST_KEY` with your `Content API key`
- Restart the content docker container

You are now able to see your newly created pages from ghost in the frontend.
You are also now able to update the Footer Links by going to Settings->Navigation->Secondary Navigation

## Development Usage
Make sure you have Node.JS 14.x installed then run the following commands in your terminal:
```
./app-install-dependencies.sh
./app-run.sh
```

## Development Docker Usage
Make sure you have docker and docker-composer installed in your machine then run the following command in your terminal:
```
docker-compose up
```

## Micro Services
### Web
* Traefik - Port: 80
* Web - Port: 3000 - [![Image Size](https://img.shields.io/docker/image-size/glenndehaan/acme-merch-store-web)](https://hub.docker.com/r/glenndehaan/acme-merch-store-web)
* Assets - Port: 3001 - [![Image Size](https://img.shields.io/docker/image-size/glenndehaan/acme-merch-store-assets)](https://hub.docker.com/r/glenndehaan/acme-merch-store-assets)
* CMS - Port: 2368

### API
* Cart - Port: 4000 - [![Image Size](https://img.shields.io/docker/image-size/glenndehaan/acme-merch-store-cart)](https://hub.docker.com/r/glenndehaan/acme-merch-store-cart)
* Content - Port: 4001 - [![Image Size](https://img.shields.io/docker/image-size/glenndehaan/acme-merch-store-content)](https://hub.docker.com/r/glenndehaan/acme-merch-store-content)
* Product - Port: 4002 - [![Image Size](https://img.shields.io/docker/image-size/glenndehaan/acme-merch-store-product)](https://hub.docker.com/r/glenndehaan/acme-merch-store-product)
* Search - Port: 4003 - [![Image Size](https://img.shields.io/docker/image-size/glenndehaan/acme-merch-store-search)](https://hub.docker.com/r/glenndehaan/acme-merch-store-search)
* Stock - Port: 4004 - [![Image Size](https://img.shields.io/docker/image-size/glenndehaan/acme-merch-store-stock)](https://hub.docker.com/r/glenndehaan/acme-merch-store-stock)
* User - Port: 4005 - [![Image Size](https://img.shields.io/docker/image-size/glenndehaan/acme-merch-store-user)](https://hub.docker.com/r/glenndehaan/acme-merch-store-user)
* Wishlist - Port: 4006 - [![Image Size](https://img.shields.io/docker/image-size/glenndehaan/acme-merch-store-wishlist)](https://hub.docker.com/r/glenndehaan/acme-merch-store-wishlist)

### Backend
* Storage - Port: 5000 - [![Image Size](https://img.shields.io/docker/image-size/glenndehaan/acme-merch-store-storage)](https://hub.docker.com/r/glenndehaan/acme-merch-store-storage)

### DB
* Redis - Port: 6379

## Resources
https://demo.vercel.store/
https://www.printful.com/nl/generator
