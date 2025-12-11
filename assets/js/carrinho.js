const Cart = {
    key: 'dchoco_cart',

    get: function() {
        const cart = localStorage.getItem(this.key);
        return cart ? JSON.parse(cart) : [];
    },

    save: function(cart) {
        localStorage.setItem(this.key, JSON.stringify(cart));
        this.updateBadge();
    },

    add: function(product) {
        const cart = this.get();
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        this.save(cart);
    },

    remove: function(id) {
        let cart = this.get();
        cart = cart.filter(item => item.id !== id);
        this.save(cart);
        this.render();
    },

    updateQuantity: function(id, change) {
        const cart = this.get();
        const item = cart.find(item => item.id === id);

        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.remove(id);
                return;
            }
            this.save(cart);
            this.render();
        }
    },

    updateBadge: function() {
        const cart = this.get();
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        const badges = document.querySelectorAll('.carrinho-badge');
        badges.forEach(badge => badge.textContent = count);
    },

    formatPrice: function(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },

    render: function() {
        const cartItemsContainer = document.getElementById('cart-items');
        if (!cartItemsContainer) return;

        const cart = this.get();
        cartItemsContainer.innerHTML = '';

        let subtotal = 0;

        cart.forEach(item => {
            const itemSubtotal = item.price * item.quantity;
            subtotal += itemSubtotal;

            const tr = document.createElement('tr');
            tr.className = 'cart-item';
            tr.innerHTML = `
                <td class="product-info">
                    <img src="${item.image}" alt="${item.name}" class="product-image" />
                    <div>
                        <h3><a href="#">${item.name}</a></h3>
                    </div>
                </td>
                <td class="price" data-label="Preço">${this.formatPrice(item.price)}</td>
                <td data-label="Quantidade">
                    <div class="quantity-wrapper">
                        <button type="button" class="quantity-btn minus" onclick="Cart.updateQuantity('${item.id}', -1)">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" readonly aria-label="Quantidade" />
                        <button type="button" class="quantity-btn plus" onclick="Cart.updateQuantity('${item.id}', 1)">+</button>
                    </div>
                </td>
                <td class="subtotal" data-label="Subtotal">${this.formatPrice(itemSubtotal)}</td>
                <td>
                    <button class="button small remove-item" onclick="Cart.remove('${item.id}')" aria-label="Remover item">
                        <i class="icon solid fa-trash"></i>
                    </button>
                </td>
            `;
            cartItemsContainer.appendChild(tr);
        });

        // Update Summary
        const shipping = subtotal > 0 ? 10.00 : 0.00; // Fixed for now, but only if cart has items
        const discount = 0.00;
        const total = subtotal + shipping - discount;

        const subtotalEl = document.getElementById('cart-subtotal');
        const totalEl = document.getElementById('cart-total');
        
        if (subtotalEl) subtotalEl.textContent = this.formatPrice(subtotal);
        if (totalEl) totalEl.textContent = this.formatPrice(total);
    },

    init: function() {
        this.updateBadge();
        
        // Setup Add to Cart buttons (Catalog)
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const product = {
                    id: btn.dataset.id,
                    name: btn.dataset.name,
                    price: parseFloat(btn.dataset.price),
                    image: btn.dataset.image
                };
                this.add(product);
            });
        });

        // Setup Buy Now buttons
        document.querySelectorAll('.buy-now-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const product = {
                    id: btn.dataset.id,
                    name: btn.dataset.name,
                    price: parseFloat(btn.dataset.price),
                    image: btn.dataset.image
                };
                this.add(product);
                window.location.href = 'carrinho.html';
            });
        });

        // Render if on cart page
        if (document.getElementById('cart-items')) {
            this.render();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Cart.init();
});
