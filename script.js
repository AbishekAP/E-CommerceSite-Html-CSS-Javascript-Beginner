document.addEventListener('DOMContentLoaded', loadcontent);
function loadcontent() {
    onCartFunctions();
    onCartBtnFunctions();
    onProfileFunctions();
    onsellerFunctions();
    OnCartItemsLoad();
    CustomerCareBtn();
    onBlurFunction();
    onLoader();
}
let profileBtnValue = 0;
let cartbtnvalue = 0;
let sellervalue = 0;
let CCBtnValue = 0;
let productDetail;
//cart open and close
function onCartBtnFunctions() {
    const crtBtn = document.getElementById("crt-btn");
    const cart = document.getElementById("crt");
    const $profileContainer = document.querySelector(".profile-container");
    const $sellerContainer = document.querySelector(".seller-container");
    const $customerCareContainer = document.querySelector(".CustomerCare-container")
    const $blurContainer = document.querySelector(".blur");
    crtBtn.addEventListener('click', () => {
        if (cartbtnvalue == 0) {
            $profileContainer.style.transform = "translateX(200%)";
            cart.style.transform = "translateX(0%)";
            $sellerContainer.style.transform = "translateY(-200%)";
            $customerCareContainer.style.transform = "translateY(-200%)";
            $blurContainer.classList.add('active');
            CCBtnValue = 0;
            sellervalue = 0;
            cartbtnvalue = 1;
            profileBtnValue = 0;
        }
        else {
            $blurContainer.classList.remove('active');
            cart.style.transform = "translateX(200%)";
            cartbtnvalue = 0;
            console.log(cartbtnvalue);
        }
    });
}
function OnCartItemsLoad() {
    let NewCartItemCount = localStorage.getItem('NewCartItemCount');
    for (let i = 1; i <= NewCartItemCount; i++) {
        if (localStorage.getItem("newCartItem" + i) == null) {
            /*Skip the Delete Items*/
        }
        else {
            /*cart Add Item to cart*/
            const $crtItem = document.createElement('div');
            $crtItem.className = 'cart-box' + ' ' + i;
            $crtItem.innerHTML = JSON.parse(localStorage.getItem("newCartItem" + i));
            let $cartTitle = $crtItem.querySelector('.crt-title');
            let productTitle = $cartTitle.innerHTML;
            let $cartPrice = $crtItem.querySelector('.price');
            let productPrice = "Price:" + $cartPrice.innerHTML;
            let productImg = $crtItem.querySelector('img');
            let productImgSrc = productImg.src;
            productDetail = { productTitle, productPrice, productImgSrc };
            itemsInCart.push(productDetail);
            const cartItems = document.getElementById("cart-items");
            cartItems.append($crtItem);
            onCartFunctions();
        }
    }
}
function onCartFunctions() {

    //delete cart item
    const crtdelitem = document.querySelectorAll('.crt-del-btn');
    crtdelitem.forEach((e) => {
        e.addEventListener('click', removeItem);
    })
    //Add Cart items
    const addcrt = document.querySelectorAll('.add-cart');
    addcrt.forEach((e) => {
        e.addEventListener('click', additemcart)
    })

    //items count defualt
    const itemcount = document.querySelectorAll('.item-count');
    itemcount.forEach((e) => {
        e.addEventListener('change', defualtItemCount);
    });
    priceholder();
}
/*call Functions*/
function removeItem() {
    console.log("remove");
    const cartItemTitle = this.parentElement.querySelector('.crt-title').innerHTML;
    if (confirm('Are you sure to delete?')) {
        itemsInCart = itemsInCart.filter(e => e.productTitle != cartItemTitle);
        let removeItemNo = (this.parentElement.className).replace("cart-box ", '');
        console.log(removeItemNo)
        localStorage.removeItem("newCartItem" + removeItemNo);
        this.parentElement.remove();
        onCartFunctions();
        onLoader();
    }

}
/*Add Itmes In Cart*/
let itemsInCart = [];
function additemcart() {
    const cartBox = this.closest('.box');
    let productTitle = cartBox.querySelector('.title').innerHTML;
    let productSubTitle = cartBox.querySelector('.sub-title').innerHTML;
    let productPrice = "Price:" + cartBox.querySelector('.price').innerHTML;
    let productImg = cartBox.querySelector('img');
    let productImgSrc = productImg.src;
    productDetail = { productTitle, productPrice, productImgSrc };
    if (itemsInCart.find((e) => e.productTitle === productDetail.productTitle)) {
        alert("this Item Already In Cart");
        return;
    } else {
        itemsInCart.push(productDetail);
    }
    let NewCartItemCount = localStorage.getItem("NewCartItemCount");
    let crtItem = document.createElement('div');
    crtItem.className = 'cart-box' + ' ' + (++NewCartItemCount);
    crtItem.innerHTML = `
        <div class="img">
            <img src="${productImgSrc}" alt="item">
        </div>
            <div class="details">
                    <h3  class="crt-title">${productTitle}</h3><span>${productSubTitle}</span>
                    <span class="price">${productPrice}</span>
                    <input type="number"  class="item-count"  value="1">
                    <span class="item-total-price">${productPrice}</span>  
            </div>
            <button type="button" class="crt-buy-btn"><i class="fa-solid fa-cart-shopping"></i></button>
            <button type="button" class="crt-del-btn"><i class="fa-solid fa-trash"></i></button>
            `;
    const cartItems = document.getElementById("cart-items");
    onLoader();
    cartItems.append(crtItem);
    localStorage.setItem("NewCartItemCount", NewCartItemCount);
    NewCartItemCount = (localStorage.getItem("NewCartItemCount"));
    localStorage.setItem("newCartItem" + NewCartItemCount, JSON.stringify(crtItem.innerHTML));
    onCartFunctions();
}
function defualtItemCount() {
    if (this.value == NaN || this.value < 1) {
        this.value = 1;
    }
    priceholder();
}
/*Price Holder*/
function priceholder() {
    let cartBox = document.querySelectorAll('.cart-box');
    let totalPrice = document.querySelector('.total-price');
    let total = 0;
    cartBox.forEach(e => {
        let priceElement = e.querySelector('.price');
        let price = parseFloat(priceElement.innerHTML.replace("Price:Rs.", ''));
        let count = e.querySelector('.item-count').value;
        total += total + (count * price);
        e.querySelector('.item-total-price').innerText = "Total Price:Rs." + (count * price);
    })
    totalPrice.innerHTML = "Rs." + total;
    let cartCount = itemsInCart.length;
    /*cart item count*/
    const cartItemCount = document.querySelector(".cart-count");
    const cartItems = document.querySelector(".IsEmpty");
    const cartPlaceOrder = document.querySelector(".cart-place-order");
    cartItemCount.innerHTML = cartCount;
    if (cartCount == 0) {
        cartItemCount.style.display = "none";
        cartItems.innerHTML = "Empty";
        cartPlaceOrder.style.display = "none";
    }
    else if (cartCount > 10) {
        cartItemCount.innerHTML = '10+';
    }
    else {
        cartItemCount.style.display = "block";
        cartItems.innerHTML = "";
        cartPlaceOrder.style.display = "flex";
    }
}
/*profile*/
function onProfileFunctions() {
    const $profileBtn = document.querySelector(".fa-circle-user");
    const $profileContainer = document.querySelector(".profile-container");
    const cart = document.getElementById("crt");
    const $sellerContainer = document.querySelector(".seller-container");
    const $customerCareContainer = document.querySelector(".CustomerCare-container")
    const $blurContainer = document.querySelector(".blur");
    $profileBtn.addEventListener('click', () => {
        if (profileBtnValue == 0) {
            cart.style.transform = "translateX(200%)";
            $profileContainer.style.transform = "translateX(0%)";
            $sellerContainer.style.transform = "translateY(-200%)";
            $customerCareContainer.style.transform = "translateY(-200%)";
            $blurContainer.classList.add('active');
            CCBtnValue = 0;
            sellervalue = 0;
            cartbtnvalue = 0;
            profileBtnValue = 1;
        }
        else {
            $blurContainer.classList.remove('active');
            $profileContainer.style.transform = "translateX(200%)";
            profileBtnValue = 0;
            $changeUsername.style.display = "none";
        }
    });
    /*change Profile*/
    const $imgFile = document.querySelector('#imgfile');
    const $profileImg = document.querySelectorAll('.profile-img');
    let profileImgSrc;
    profileImgSrc = localStorage.getItem("profileImgSrc");
    if (profileImgSrc == null) {
        $profileImg.forEach(e => {
            e.setAttribute('src', "img/profile/add-new-icon.png");
        })
    } else {
        $profileImg.forEach(e => {
            e.setAttribute('src', profileImgSrc);
        })
    }
    $imgFile.addEventListener('change', (e) => {
        let imgFile = e.target.files[0];
        const Reader = new FileReader();
        Reader.readAsDataURL(imgFile);
        Reader.addEventListener('load', () => {
            localStorage.setItem("profileImgSrc", Reader.result);
            profileImgSrc = localStorage.getItem("profileImgSrc");
            onLoader();
            $profileImg.forEach(e => {
                e.setAttribute('src', profileImgSrc);
            });
        });

    });
    /*change username*/
    const $editUsername = document.querySelector("#edit-username");
    const $changeUsername = document.querySelector(".change-username");
    let editUsernamevalue = 0;
    $editUsername.addEventListener('click', () => {
        if (editUsernamevalue == 0) {
            $changeUsername.style.display = "block";
            editUsernamevalue = 1;
        }
        else {
            $changeUsername.style.display = "none";
            editUsernamevalue = 0;
        }

    });
    const $setUsername = document.querySelector("#set-username");
    const $getUsername = document.querySelector("#get-username");
    const $userName = document.querySelectorAll(".user-name");
    if (localStorage.getItem("username") == null) {
        $userName.forEach(e => {
            e.textContent = "User Name";
        })
    } else {
        $userName.forEach(e => {
            e.textContent = localStorage.getItem("username");
        })
    }

    $setUsername.addEventListener('click', () => {
        let username = $getUsername.value;
        localStorage.setItem("username", username);
        if ($getUsername.value == '') {
            $getUsername.style.borderColor = "var(--red)";
        }
        else {
            onLoader();
            $userName.forEach(e => {
                e.textContent = localStorage.getItem("username");
            });
            $changeUsername.style.display = "none";
            editUsernamevalue = 0;
            $getUsername.style.borderColor = "var(--green)";
        }
    });
}
/*Seller*/
function onsellerFunctions() {
    const $seller = document.querySelectorAll(".seller");
    const $sellerContainer = document.querySelector(".seller-container");
    const cart = document.getElementById("crt");
    const $profileContainer = document.querySelector(".profile-container");
    const $customerCareContainer = document.querySelector(".CustomerCare-container");
    const $blurContainer = document.querySelector(".blur");
    $seller.forEach(e => {
        e.addEventListener('click', () => {
            if (sellervalue == 0) {
                $profileContainer.style.transform = "translateX(200%)";
                cart.style.transform = "translateX(200%)";
                $sellerContainer.style.transform = "translateY(0%)";
                $customerCareContainer.style.transform = "translateY(-200%)";
                $blurContainer.classList.add('active');
                CCBtnValue = 0;
                cartbtnvalue = 0;
                profileBtnValue = 0;
                sellervalue = 1;
            }
            else {
                $sellerContainer.style.transform = "translateY(-200%)";
                $blurContainer.classList.remove("active");
                sellervalue = 0;
            }
        });
    })
    onSellerNavOpen();
    let NewItemCount = localStorage.getItem('NewItemCount');
    for (let i = 1; i <= NewItemCount; i++) {
        if (localStorage.getItem("newItem" + i) == null) {
            /*Skip the Delete Items*/
        }
        else {
            /*Sell Item to Seller Portal*/
            const $sellNewBox = document.createElement('div');
            $sellNewBox.className = 'sell-product-box' + ' ' + i;
            $sellNewBox.innerHTML = JSON.parse(localStorage.getItem("newItem" + i));
            const $sellContainer = document.querySelector('.selling-products');
            $sellContainer.appendChild($sellNewBox);
            /*Sell Item to Categories*/
            const $box = create = document.createElement('div');
            $box.className = "box";
            $box.id = "box" + i;
            $box.innerHTML = JSON.parse(localStorage.getItem("newItemToCat" + i));
            const $categories = document.querySelector(localStorage.getItem("ItemCat" + i));
            const $boxContainer = $categories.querySelector(".box-container");
            $boxContainer.appendChild($box);
            removeSellItem();
        }

    }
    const $sellBtn = document.querySelector(".sell-btn");
    const $sellTitle = document.querySelector(".sell-prt-title");
    const $sellSubTitle = document.querySelector(".sell-prt-subtitle");
    const $sellOrgPrice = document.querySelector(".sell-prt-or-price");
    const $sellPrice = document.querySelector(".sell-prt-sl-price");
    const $sellCategories = document.querySelector("#sell-prt-categories");
    const $sellImage = document.querySelector('#sell-prt-img');
    let sellImageSrc;
    $sellImage.addEventListener('change', (e) => {
        let imgFile = e.target.files[0];
        const Reader = new FileReader();
        Reader.readAsDataURL(imgFile);
        Reader.addEventListener('load', () => {
            sellImageSrc = Reader.result;
        });
    })
    $sellBtn.addEventListener('click', () => {
        if ($sellTitle.value == '' || $sellSubTitle.value == '' || $sellOrgPrice.value === '' || $sellPrice.value == '' || $sellCategories.value == '') {
            $sellBtn.style.backgroundColor = "var(--red)";
        }
        else {
            $sellBtn.style.backgroundColor = "var(--green)";
            AddToSellProducts();
            AddToCategories();
            ClearAllInputs();
            removeSellItem();
            onLoader();
        }
    });
    function AddToSellProducts() {
        NewItemCount = localStorage.getItem("NewItemCount");
        const $sellNewBox = document.createElement('div');
        $sellNewBox.className = 'sell-product-box' + ' ' + (++NewItemCount);
        $sellNewBox.innerHTML = ` 
        <div class="sell-prt-img">
            <img src="${sellImageSrc}" alt="item">
        </div>
            <div class="sell-product-details">
                    <h3  class="crt-title">${$sellTitle.value}</h3><span>${$sellSubTitle.value}</span>
                    <span class="Selling-price"><span>Price:</span>${$sellPrice.value}</span>
            </div>
            <button type="button" class="sell-prt-delbtn"><i class="fa-solid fa-trash"></i></button>
        </div>`;
        localStorage.setItem("NewItemCount", NewItemCount);
        localStorage.setItem("newItem" + NewItemCount, JSON.stringify($sellNewBox.innerHTML));
        const $sellContainer = document.querySelector('.selling-products');
        $sellContainer.appendChild($sellNewBox);
    }
    function AddToCategories() {
        const $box = create = document.createElement('div');
        $box.className = "box";
        $box.id = "box" + NewItemCount;
        let discount = ($sellOrgPrice.value - $sellPrice.value) / $sellOrgPrice.value * 100;
        $box.innerHTML = `
        <span class="discount">-${discount}%</span>
            <div class="image">
                <img src="${sellImageSrc}" class="image">
                <div class="icons">
                    <button class="cart-btn">Buy</button>
                    <button href="" class="cart-btn add-cart">add cart</button>
                </div>
            </div>
            <div class="content">
                <h3 class="title">${$sellTitle.value}</h3><span class="sub-title">${$sellSubTitle.value}</span>
                <div class="price">Rs.${$sellPrice.value}</div><span class="origenal-price">Rs.${$sellOrgPrice.value}</span>
            </div>
        `;
        localStorage.setItem("newItemToCat" + NewItemCount, JSON.stringify($box.innerHTML));
        localStorage.setItem("ItemCat" + NewItemCount, $sellCategories.value);
        const $categories = document.querySelector($sellCategories.value);
        const $boxContainer = $categories.querySelector(".box-container");
        $boxContainer.appendChild($box);
    }
    function ClearAllInputs() {
        $sellTitle.value = '';
        $sellSubTitle.value = '';
        $sellOrgPrice.value = '';
        $sellPrice.value = '';
        $sellCategories.value = '';
        $sellImage.files[0] = '';
    }
    function removeSellItem() {
        const $sellDelBtn = document.querySelectorAll(".sell-prt-delbtn");
        $sellDelBtn.forEach(e => {
            e.addEventListener('click', () => {
                onLoader();
                let newItemNo = (e.parentElement.className).replace("sell-product-box ", '');
                e.parentElement.remove();
                localStorage.removeItem("newItem" + newItemNo);
                localStorage.removeItem("newItemToCat" + newItemNo);
                localStorage.removeItem("ItemCat" + newItemNo);
                let newItemToCatName = "#box" + NewItemCount;
                document.querySelector(newItemToCatName).remove();
            })
        })
    }

}
function onSellerNavOpen() {
    const $addNewProduct = document.querySelector("#add-new-prt");
    const $sellProducts = document.querySelector("#sell-prts");
    const $addNewProductContainer = document.querySelector(".add-new-product");
    const $sellProductContainer = document.querySelector(".selling-products");
    $sellProducts.addEventListener('click', () => {
        $sellProductContainer.style.display = "flex";
        $addNewProductContainer.style.display = "none";
        $sellProducts.style.backgroundColor = "#fff";
        $addNewProduct.style.backgroundColor = "var(--lightgreen)";
        $sellProducts.style.color = "var(--green)";
        $addNewProduct.style.color = "#fff";
    })
    $addNewProduct.addEventListener('click', () => {
        $sellProductContainer.style.display = "none";
        $addNewProductContainer.style.display = "flex";
        $addNewProduct.style.backgroundColor = "#fff";
        $sellProducts.style.backgroundColor = "var(--lightgreen)";
        $addNewProduct.style.color = "var(--green)";
        $sellProducts.style.color = "#fff";
    })
}
function onLoader() {
    const $loader = document.querySelector('.loader-box');
    $loader.style.display = "flex";
    setTimeout(offloader, 1000);
}
function offloader() {
    const $loader = document.querySelector('.loader-box');
    $loader.style.display = "none";
}
function send() {
    let outputbox = document.querySelector('.outputbox');
    let inputvalue = document.getElementById('inputtext').value;
    console.log(inputvalue);

    let usermsg = document.createElement('li');
    let botmsg = document.createElement('li');
    let id = new Date().getTime();
    let outputvalue;

    if (inputvalue == '') {
        alert("Con't send Empty Messages");
    }
    else {
        userinput();
        if (/(^hi)/ig.test(inputvalue)) {
            outputvalue = "Welcome To NetKart";
            setTimeout(botresult, 1000);
        }
        else if (/(^help)/ig.test(inputvalue)) {
            outputvalue = "What I do..!";
            setTimeout(botresult, 1000);
        }
        else if (/(^Issus)/ig.test(inputvalue)) {
            outputvalue = `What Type issus?
            1.Refued Issus,
            2.Orders Issus,
            3.payment Issus
            `;
            setTimeout(botresult, 1000);
        }
        else if (inputvalue == 'Refued Issus' || inputvalue == 'Orders Issus' || inputvalue == 'payment Issus') {
            outputvalue = "Your Requst send to HeadOffice";
            setTimeout(botresult, 1000);
        }
        else {
            outputvalue = "I Can't  Understand";
            setTimeout(botresult, 1000);
        }
        document.getElementById('inputtext').value = "";
    }

    function userinput() {
        usermsg.innerHTML = `<span id="${id}" class="userinput">${inputvalue}</span>`;
        outputbox.append(usermsg);
        outputbox.scrollTo(0, outputbox.scrollHeight);
    }
    function botresult() {
        botmsg.innerHTML = `<span id="${id}" class="botoutput">${outputvalue}</span>`;
        outputbox.append(botmsg);
        outputbox.scrollTo(0, outputbox.scrollHeight);
    }
}
function CustomerCareBtn() {

    const $customerCareBtn = document.querySelectorAll(".CustomerCare");
    const $customerCareContainer = document.querySelector(".CustomerCare-container")
    const $profileContainer = document.querySelector(".profile-container");
    const $sellerContainer = document.querySelector(".seller-container");
    const $blurContainer = document.querySelector(".blur");
    const cart = document.getElementById("crt");
    $customerCareBtn.forEach(e=>{
        e. addEventListener('click', () => {
            if (CCBtnValue == 0) {
                $customerCareContainer.style.transform = "translateY(0%)";
                cart.style.transform = "translateX(200%)";
                $profileContainer.style.transform = "translateX(200%)";
                $sellerContainer.style.transform = "translateY(-200%)";
                $blurContainer.classList.add('active');
                sellervalue = 0;
                profileBtnValue = 0;
                cartbtnvalue = 0;
                CCBtnValue = 1;
    
            }
            else {
                $customerCareContainer.style.transform = "translateY(-200%)";
                $blurContainer.classList.remove('active');
                CCBtnValue = 0;
            }
    })
    })
}
function onBlurFunction(){
    const $customerCareContainer = document.querySelector(".CustomerCare-container")
    const $profileContainer = document.querySelector(".profile-container");
    const $sellerContainer = document.querySelector(".seller-container");
    const $blurContainer = document.querySelector(".blur");
    const $cartContainer = document.getElementById("crt");
    $blurContainer.addEventListener('click',()=>{
        $cartContainer.style.transform = "translateX(200%)";
        $profileContainer.style.transform = "translateX(200%)";
        $sellerContainer.style.transform = "translateY(-200%)";
        $customerCareContainer.style.transform = "translateY(-200%)";
        $blurContainer.classList.remove("active");
        profileBtnValue = 0;
        cartbtnvalue = 0;
        sellervalue = 0;
        CCBtnValue = 0;
    })
}