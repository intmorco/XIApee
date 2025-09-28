let db = null;
let currentUser = null;
let order = null;

const orderIdEl = document.getElementById('order-id');
const statusEl = document.getElementById('status');
const dropOffEl = document.getElementById('drop-off');
const staffNameEl = document.getElementById('staff-name');
const staffPhoneEl = document.getElementById('staff-phone');
const itemsEl = document.getElementById('items');
const billSub = document.getElementById('bill-subtotal');
const billDel = document.getElementById('bill-delivery');
const billTot = document.getElementById('bill-total');
const successEl = document.getElementById('success');

function getParamId() {
    const p = new URLSearchParams(window.location.search);
    return p.get('id');
}

function getEffectiveDB() {
    try {
        const o = localStorage.getItem('xiapee_db_override');
        if (o) return JSON.parse(o);
    } catch {}
    return null;
}

async function loadDB() {
    const res = await fetch('/data/db.json');
    const base = await res.json();
    const override = getEffectiveDB();
    db = override || base;
    currentUser = db.users?.[0] || null;
}

function findOrder(id) {
    return (db.orders||[]).find(o => o.id === id) || (currentUser?.orderHistory||[]).find(o => o.id === id) || null;
}

function render() {
    if (!order) return;
    orderIdEl.textContent = order.id;
    statusEl.textContent = order.status;
    dropOffEl.textContent = order.dropOff || '-';
    staffNameEl.textContent = order.staff?.name || '-';
    if (order.staff?.phone) { staffPhoneEl.href = `tel:${order.staff.phone}`; staffPhoneEl.textContent = order.staff.phone; }
    itemsEl.innerHTML = (order.items||[]).map(it => `<div class="it"><span>${it.name} × ${it.qty}</span><span>RM ${(it.price * it.qty).toFixed(2)}</span></div>`).join('');
    billSub.textContent = `RM ${Number(order.subtotal||0).toFixed(2)}`;
    billDel.textContent = `RM ${Number(order.deliveryFee||0).toFixed(2)}`;
    billTot.textContent = `RM ${Number(order.total||0).toFixed(2)}`;
}

function progressStatus() {
    const flow = ["Order Confirmed", "Being Prepared", "Out for Delivery", "Delivered"];
    const idx = flow.indexOf(order.status);
    if (idx < 0 || idx >= flow.length-1) return false;
    order.status = flow[idx+1];
    // write back to db override
    const eff = getEffectiveDB() || db;
    const users = (eff.users||[]).map(u => {
        if (u.id !== order.userId) return u;
        const hist = (u.orderHistory||[]).map(o => o.id === order.id ? { ...o, status: order.status, timestamp: new Date().toISOString() } : o);
        return { ...u, orderHistory: hist };
    });
    const orders = (eff.orders||[]).map(o => o.id === order.id ? { ...o, status: order.status, timestamp: new Date().toISOString() } : o);
    const newDB = { ...eff, users, orders };
    localStorage.setItem('xiapee_db_override', JSON.stringify(newDB));
    db = newDB;
    render();
    if (order.status === 'Delivered') {
        successEl.style.display = 'block';
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadDB();
    const id = getParamId();
    order = findOrder(id);
    if (!order) {
        statusEl.textContent = 'Order not found';
        return;
    }
    render();

    // simulate every 10s
    let active = true;
    function tick() {
        if (!active) return;
        active = progressStatus();
        if (active) setTimeout(tick, 10000);
    }
    setTimeout(tick, 10000);
});

