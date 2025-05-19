modalUpdateOverlay.addEventListener('click', (event) => {
    const url = document.getElementById('upd-url')
    const title = document.getElementById('upd-title')
    const subtitle = document.getElementById('upd-subtitle')
    const price = document.getElementById('upd-price')



    if (event.target.dataset.inp === 'closed' || event.target.dataset.inp === 'cancel') {
        modalUpdateOverlay.style.display = 'none'
        document.body.style.overflow = ''
    }
    if (event.target.dataset.inp === 'apply') {
        const index = myTovars.findIndex(tovar => tovar.id === tovarId);
        const basketIindex = basketTovars.findIndex(tovar => tovar.id === tovarId);


        if (basketIindex !== -1) {
            basketTovars[basketIindex].imgUrl = url.value
            basketTovars[basketIindex].title = title.value
            basketTovars[basketIindex].subtitle = subtitle.value
            basketTovars[basketIindex].price = price.value
            localStorage.setItem('basketGoods', JSON.stringify(basketTovars));
            renderBasket();
        }

        myTovars[index].imgUrl = url.value
        myTovars[index].title = title.value
        myTovars[index].subtitle = subtitle.value
        myTovars[index].price = price.value
        localStorage.setItem('tovars', JSON.stringify(myTovars));


        renderProducts();
        modalUpdateOverlay.style.display = 'none'
        document.body.style.overflow = '';
    }

})