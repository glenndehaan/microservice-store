# Microservice Store

## Development Usage
Make sure you have Node.JS 14.x installed then run the following commands in your terminal:
```
./app-install-dependencies.sh
./app-run.sh
```

## Docker Usage
Make sure you have docker and docker-composer installed in your machine then run the following command in your terminal:
```
docker-compose up
```

## Micro Services
### Web
* Traefik - Port: 80
* Web - Port: 3000
* Assets - Port: 3001
* CMS - Port: 2368

### API
* Cart - Port: 4000
* Content - Port: 4001
* Product - Port: 4002
* Search - Port: 4003
* Stock - Port: 4004
* User - Port: 4005
* Wishlist - Port: 4006

### Backend
* Storage - Port: 5000

### DB
* Redis - Port: 6379

## Resources
https://demo.vercel.store/
https://www.printful.com/nl/generator
