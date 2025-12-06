/**
 * 医院挂号小程序原型 - 交互逻辑
 */

// 页面历史记录栈
const pageHistory = ['page-home'];
let currentPage = 'page-home';

// 选中的数据
let selectedDepartment = '';
let selectedDoctor = '';
let selectedDate = '';
let selectedTime = '';

/**
 * 导航到指定页面
 * @param {string} pageId - 目标页面ID
 */
function navigateTo(pageId) {
    const currentPageEl = document.getElementById(currentPage);
    const targetPageEl = document.getElementById(pageId);
    
    if (currentPageEl && targetPageEl) {
        currentPageEl.classList.remove('active');
        targetPageEl.classList.add('active');
        
        // 更新历史记录
        pageHistory.push(pageId);
        currentPage = pageId;
        
        // 更新底部导航栏状态
        updateTabBar(pageId);
        
        // 滚动到顶部
        const content = targetPageEl.querySelector('.content');
        if (content) {
            content.scrollTop = 0;
        }
    }
}

/**
 * 返回上一页
 */
function goBack() {
    if (pageHistory.length > 1) {
        pageHistory.pop();
        const previousPage = pageHistory[pageHistory.length - 1];
        
        const currentPageEl = document.getElementById(currentPage);
        const targetPageEl = document.getElementById(previousPage);
        
        if (currentPageEl && targetPageEl) {
            currentPageEl.classList.remove('active');
            targetPageEl.classList.add('active');
            currentPage = previousPage;
            
            // 更新底部导航栏状态
            updateTabBar(previousPage);
        }
    }
}

/**
 * 切换Tab页面（底部导航）
 * @param {string} pageId - 目标页面ID
 */
function switchTab(pageId) {
    // 清空历史记录，重新开始
    pageHistory.length = 0;
    pageHistory.push(pageId);
    
    const currentPageEl = document.getElementById(currentPage);
    const targetPageEl = document.getElementById(pageId);
    
    if (currentPageEl && targetPageEl) {
        currentPageEl.classList.remove('active');
        targetPageEl.classList.add('active');
        currentPage = pageId;
        
        // 更新底部导航栏状态
        updateTabBar(pageId);
    }
}

/**
 * 更新底部导航栏状态
 * @param {string} pageId - 当前页面ID
 */
function updateTabBar(pageId) {
    const tabItems = document.querySelectorAll('.tab-item');
    tabItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // 根据页面ID设置对应的tab为激活状态
    const tabMapping = {
        'page-home': 0,
        'page-departments': 1,
        'page-doctors': 1,
        'page-schedule': 1,
        'page-confirm': 1,
        'page-success': 1,
        'page-appointments': 2,
        'page-profile': 3
    };
    
    const tabIndex = tabMapping[pageId];
    if (tabIndex !== undefined && tabItems[tabIndex]) {
        tabItems[tabIndex].classList.add('active');
    }
}

/**
 * 选择科室
 * @param {string} department - 科室名称
 */
function selectDepartment(department) {
    selectedDepartment = department;
    
    // 更新医生列表页的标题
    const titleEl = document.getElementById('doctor-list-title');
    if (titleEl) {
        titleEl.textContent = department;
    }
    
    // 导航到医生列表页
    navigateTo('page-doctors');
}

/**
 * 选择医生
 * @param {string} doctor - 医生名称
 */
function selectDoctor(doctor) {
    selectedDoctor = doctor;
    
    // 更新时间选择页的医生名称
    const doctorNameEl = document.getElementById('selected-doctor-name');
    if (doctorNameEl) {
        doctorNameEl.textContent = doctor;
    }
    
    // 导航到时间选择页
    navigateTo('page-schedule');
}

/**
 * 选择日期
 * @param {HTMLElement} element - 被点击的日期元素
 */
function selectDate(element) {
    // 检查是否可选
    const status = element.querySelector('.status');
    if (status && (status.classList.contains('full') || status.classList.contains('rest'))) {
        showToast('该日期不可预约');
        return;
    }
    
    // 移除其他日期的选中状态
    const dateItems = document.querySelectorAll('.date-item');
    dateItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // 设置当前日期为选中状态
    element.classList.add('active');
    
    // 记录选中的日期
    const dateText = element.querySelector('.date');
    if (dateText) {
        selectedDate = dateText.textContent;
    }
}

/**
 * 选择时间段
 * @param {HTMLElement} element - 被点击的时间段元素
 */
function selectTime(element) {
    // 检查是否已满
    if (element.classList.contains('full')) {
        showToast('该时段已满');
        return;
    }
    
    // 移除其他时间段的选中状态
    const timeSlots = document.querySelectorAll('.time-slot');
    timeSlots.forEach(slot => {
        slot.classList.remove('active');
    });
    
    // 设置当前时间段为选中状态
    element.classList.add('active');
    
    // 记录选中的时间
    const timeText = element.querySelector('.time');
    if (timeText) {
        selectedTime = timeText.textContent;
    }
}

/**
 * 提交预约
 */
function submitAppointment() {
    // 模拟支付过程
    showToast('支付中...');
    
    setTimeout(() => {
        // 导航到成功页面
        navigateTo('page-success');
    }, 1000);
}

/**
 * 显示提示信息
 * @param {string} message - 提示信息
 */
function showToast(message) {
    // 创建toast元素
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        toast.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.7);
            color: #fff;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.style.opacity = '1';
    
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 2000);
}

/**
 * 初始化科室Tab切换
 */
function initDepartmentTabs() {
    const tabs = document.querySelectorAll('.dept-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有tab的激活状态
            tabs.forEach(t => t.classList.remove('active'));
            // 设置当前tab为激活状态
            this.classList.add('active');
        });
    });
}

/**
 * 初始化预约状态Tab切换
 */
function initAppointmentTabs() {
    const tabs = document.querySelectorAll('.appointment-tabs .tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

/**
 * 初始化就诊人选择
 */
function initPatientSelector() {
    const patientCards = document.querySelectorAll('.patient-card');
    patientCards.forEach(card => {
        card.addEventListener('click', function() {
            patientCards.forEach(c => {
                c.classList.remove('active');
                const icon = c.querySelector('.check-icon i');
                if (icon) {
                    icon.className = 'far fa-circle';
                }
            });
            
            this.classList.add('active');
            const icon = this.querySelector('.check-icon i');
            if (icon) {
                icon.className = 'fas fa-check-circle';
            }
        });
    });
}

/**
 * 初始化协议勾选框
 */
function initAgreement() {
    const checkbox = document.querySelector('.agreement .checkbox');
    if (checkbox) {
        checkbox.addEventListener('click', function() {
            this.classList.toggle('checked');
        });
    }
}

/**
 * 初始化Banner轮播
 */
function initBanner() {
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.banner-dots .dot');
    let currentSlide = 0;
    
    if (slides.length > 1) {
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            
            currentSlide = (currentSlide + 1) % slides.length;
            
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }, 3000);
    }
}

/**
 * 更新时间
 */
function updateTime() {
    const timeEl = document.querySelector('.status-bar .time');
    if (timeEl) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        timeEl.textContent = `${hours}:${minutes}`;
    }
}

/**
 * 页面初始化
 */
function init() {
    // 更新时间
    updateTime();
    setInterval(updateTime, 60000);
    
    // 初始化各种交互
    initDepartmentTabs();
    initAppointmentTabs();
    initPatientSelector();
    initAgreement();
    initBanner();
    
    // 添加搜索框焦点效果
    const searchInputs = document.querySelectorAll('.search-box input');
    searchInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.boxShadow = '0 0 0 2px rgba(79, 172, 254, 0.3)';
        });
        input.addEventListener('blur', function() {
            this.parentElement.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
        });
    });
    
    // 添加快捷功能的悬停效果
    const actionItems = document.querySelectorAll('.action-item');
    actionItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
