// 页面导航状态
let currentPage = 'home-page';
let pageHistory = [];

// 显示指定页面
function showPage(pageId) {
    // 保存历史记录
    if (currentPage !== pageId) {
        pageHistory.push(currentPage);
    }
    
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // 显示目标页面
    document.getElementById(pageId).classList.add('active');
    currentPage = pageId;
    
    // 滚动到顶部
    window.scrollTo(0, 0);
}

// 返回上一页
function goBack() {
    if (pageHistory.length > 0) {
        const previousPage = pageHistory.pop();
        
        // 隐藏所有页面
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // 显示上一页
        document.getElementById(previousPage).classList.add('active');
        currentPage = previousPage;
        
        // 滚动到顶部
        window.scrollTo(0, 0);
    }
}

// 显示医生列表
function showDoctorList(department) {
    document.getElementById('department-title').textContent = department + '医生';
    showPage('doctor-list-page');
}

// 显示预约页面
function showAppointmentPage(doctorName, doctorTitle) {
    document.getElementById('selected-doctor-name').textContent = doctorName;
    document.getElementById('selected-doctor-title').textContent = doctorTitle + ' | 内科';
    showPage('appointment-page');
}

// 显示预约确认页面
function showConfirmation() {
    showPage('confirmation-page');
}

// 显示我的预约页面
function showMyAppointments() {
    showPage('my-appointments-page');
}

// 显示首页
function showHomePage() {
    pageHistory = [];
    showPage('home-page');
}

// 过滤按钮交互
document.addEventListener('DOMContentLoaded', function() {
    // 处理过滤按钮
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有活动状态
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
            });
            // 添加当前按钮的活动状态
            this.classList.add('active');
        });
    });
    
    // 处理日期选择按钮
    document.querySelectorAll('.date-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('disabled')) {
                // 移除所有活动状态
                document.querySelectorAll('.date-btn').forEach(b => {
                    b.classList.remove('active');
                });
                // 添加当前按钮的活动状态
                this.classList.add('active');
            }
        });
    });
    
    // 处理时间槽选择
    document.querySelectorAll('.time-slot').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('disabled')) {
                // 移除所有活动状态
                document.querySelectorAll('.time-slot').forEach(b => {
                    b.classList.remove('active');
                });
                // 添加当前按钮的活动状态
                this.classList.add('active');
            }
        });
    });
    
    // 处理标签页切换
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有活动状态
            document.querySelectorAll('.tab').forEach(t => {
                t.classList.remove('active');
            });
            // 添加当前标签的活动状态
            this.classList.add('active');
            
            // 这里可以添加切换内容的逻辑
            // 实际项目中会根据标签显示不同的预约列表
        });
    });
    
    // 处理底部导航
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有活动状态
            document.querySelectorAll('.nav-item').forEach(i => {
                i.classList.remove('active');
            });
            // 添加当前项的活动状态
            this.classList.add('active');
        });
    });
    
    // 搜索栏交互效果
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('focus', function() {
            this.parentElement.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.3)';
        });
        
        searchInput.addEventListener('blur', function() {
            this.parentElement.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        });
    }
    
    // 添加卡片悬停效果音效（可选）
    const cards = document.querySelectorAll('.department-card, .doctor-card, .quick-link');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
});

// 模拟取消预约功能
function cancelAppointment(appointmentId) {
    if (confirm('确定要取消预约吗？')) {
        alert('预约已取消');
        // 实际项目中会调用API取消预约
    }
}

// 模拟查看详情功能
function viewAppointmentDetail(appointmentId) {
    alert('查看预约详情 - ID: ' + appointmentId);
    // 实际项目中会跳转到详情页面
}

// 添加页面加载动画
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.3s';
        document.body.style.opacity = '1';
    }, 100);
});

// 防止快速点击导致的重复操作
let isNavigating = false;
const originalShowPage = showPage;
showPage = function(pageId) {
    if (isNavigating) return;
    isNavigating = true;
    originalShowPage(pageId);
    setTimeout(() => {
        isNavigating = false;
    }, 300);
};

// 添加键盘导航支持
document.addEventListener('keydown', function(e) {
    // ESC键返回
    if (e.key === 'Escape') {
        goBack();
    }
});

// 添加触摸滑动返回支持（移动端）
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    // 从左向右滑动超过100px，返回上一页
    if (touchEndX > touchStartX + 100) {
        goBack();
    }
}

// 模拟数据加载
function simulateDataLoading() {
    // 实际项目中会从服务器加载数据
    console.log('医院挂号小程序已加载');
}

// 初始化
simulateDataLoading();

// 导出函数供HTML使用
window.showPage = showPage;
window.goBack = goBack;
window.showDoctorList = showDoctorList;
window.showAppointmentPage = showAppointmentPage;
window.showConfirmation = showConfirmation;
window.showMyAppointments = showMyAppointments;
window.showHomePage = showHomePage;
window.cancelAppointment = cancelAppointment;
window.viewAppointmentDetail = viewAppointmentDetail;
