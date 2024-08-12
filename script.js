document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.item');
  const descriptionContainer = document.getElementById('description-container');
  const totalElement = document.getElementById('total');
  const orderButton = document.getElementById('order-button');
  const modal = document.getElementById('modal');
  const closeModalButton = document.getElementById('close-modal');
  const confirmOrderButton = document.getElementById('confirm-order');
  const modalOrderSummary = document.getElementById('modal-order-summary');
  const modalTotal = document.getElementById('modal-total');

  const calculateTotal = () => {
    let total = 0;
    const orderItems = [];
    items.forEach(item => {
      const checkbox = item.querySelector('input[type="checkbox"]');
      const quantityInput = item.querySelector('.quantity-input');
      if (checkbox.checked) {
        const price = parseFloat(checkbox.value);
        const quantity = parseInt(quantityInput.value);
        total += price * quantity;
        orderItems.push({
          name: item.querySelector('label').textContent.split(' - ')[0],
          quantity,
          price: (price * quantity).toFixed(2)
        });
      }
    });
    totalElement.textContent = total.toFixed(2);
    return { items: orderItems, total: total.toFixed(2) };
  };

  const updateOrderSummary = () => {
    let orderSummary = '';
    items.forEach(item => {
      const checkbox = item.querySelector('input[type="checkbox"]');
      const quantityInput = item.querySelector('.quantity-input');
      if (checkbox.checked) {
        const label = item.querySelector('label').textContent;
        const quantity = quantityInput.value;
        orderSummary += `<p>${label} - Quantidade: ${quantity}</p>`;
      }
    });
    modalOrderSummary.innerHTML = orderSummary;
    modalTotal.textContent = calculateTotal().total;
  };

  items.forEach(item => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    const quantityInput = item.querySelector('.quantity-input');
    quantityInput.style.display = 'none';

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        quantityInput.style.display = 'inline-block';
      } else {
        quantityInput.style.display = 'none';
        quantityInput.value = 1;
      }
      calculateTotal();
    });

    quantityInput.addEventListener('input', () => {
      if (quantityInput.value < 1) quantityInput.value = 1;
      calculateTotal();
    });

    item.addEventListener('mouseover', (event) => {
      const description = item.getAttribute('data-description');
      if (description) {
        descriptionContainer.textContent = description;
        descriptionContainer.style.display = 'block';
        descriptionContainer.style.left = `${event.pageX + 10}px`;
        descriptionContainer.style.top = `${event.pageY + 10}px`;
      }
    });

    item.addEventListener('mousemove', (event) => {
      descriptionContainer.style.left = `${event.pageX + 10}px`;
      descriptionContainer.style.top = `${event.pageY + 10}px`;
    });

    item.addEventListener('mouseout', () => {
      descriptionContainer.style.display = 'none';
    });
  });

  orderButton.addEventListener('click', () => {
    updateOrderSummary();
    modal.style.display = 'block';
  });

  closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  confirmOrderButton.addEventListener('click', () => {
    const order = calculateTotal();
    localStorage.setItem('order', JSON.stringify(order));
    window.location.href = 'confirmar.html';
  });

  window.addEventListener('click', (event) => {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  });

  calculateTotal();
});
