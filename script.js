// 全局状态管理
const appState = {
    selectedDepartment: '',
    selectedDoctor: '',
    selectedDate: '',
    selectedTime: '',
    selectedPrice: 0
};

// 页面切换
function showPage(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // 显示目标页面
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

// 选择科室
function selectDepartment(deptName, nextPage) {
    appState.selectedDepartment = deptName;
    
    // 更新科室选择页面的标题
    const currentDeptElement = document.getElementById('current-dept');
    if (currentDeptElement) {
        currentDeptElement.textContent = deptName;
    }
    
    // 更新摘要中的科室信息
    updateSummary('dept', deptName);
    
    if (nextPage) {
        showPage(nextPage);
    }
}

// 选择医生
function selectDoctor(doctorName, nextPage) {
    appState.selectedDoctor = doctorName;
    
    // 更新摘要中的医生信息
    updateSummary('doctor', doctorName);
    
    if (nextPage) {
        showPage(nextPage);
    }
}

// 更新摘要信息
function updateSummary(type, value) {
    if (type === 'dept') {
        const summaryDept = document.getElementById('summary-dept');
        const confirmDept = document.getElementById('confirm-dept');
        if (summaryDept) summaryDept.textContent = value;
        if (confirmDept) confirmDept.textContent = value;
    } else if (type === 'doctor') {
        const summaryDoctor = document.getElementById('summary-doctor');
        const confirmDoctor = document.getElementById('confirm-doctor');
        if (summaryDoctor) summaryDoctor.textContent = value;
        if (confirmDoctor) confirmDoctor.textContent = value;
    } else if (type === 'date') {
        const confirmDate = document.getElementById('confirm-date');
        if (confirmDate) confirmDate.textContent = value;
    } else if (type === 'time') {
        const confirmTime = document.getElementById('confirm-time');
        if (confirmTime) confirmTime.textContent = value;
    }
}

// 选择日期
function selectDate(date, element) {
    // 移除所有选中状态
    document.querySelectorAll('.date-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 添加选中状态
    element.classList.add('active');
    
    appState.selectedDate = date;
    updateSummary('date', date);
    
    // 更新确认页面的日期
    const confirmDate = document.getElementById('confirm-date');
    if (confirmDate) {
        const dateText = element.querySelector('.date-date').textContent;
        confirmDate.textContent = `${date} ${dateText}`;
    }
}

// 选择时间段
function selectTime(time, element) {
    // 如果时间段不可用，直接返回
    if (element.classList.contains('unavailable')) {
        return;
    }
    
    // 移除所有选中状态
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // 添加选中状态
    element.classList.add('selected');
    
    appState.selectedTime = time;
    updateSummary('time', time);
    
    // 启用确认按钮
    const confirmBtn = document.getElementById('confirm-btn');
    if (confirmBtn) {
        confirmBtn.disabled = false;
    }
}

// 筛选医生
function filterDoctors(filter) {
    // 更新标签状态
    document.querySelectorAll('.filter-tabs .tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // 这里可以添加实际的筛选逻辑
    // 目前只是演示，实际应用中需要根据筛选条件过滤医生列表
    console.log('筛选医生:', filter);
}

// 筛选预约
function filterAppointments(filter) {
    // 更新标签状态
    document.querySelectorAll('.appointment-tabs .tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // 这里可以添加实际的筛选逻辑
    console.log('筛选预约:', filter);
}

// 提交预约
function submitAppointment() {
    // 验证必填信息
    if (!appState.selectedDepartment || !appState.selectedDoctor || 
        !appState.selectedDate || !appState.selectedTime) {
        alert('请完成所有必填信息');
        return;
    }
    
    // 显示成功模态框
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.add('active');
    }
    
    // 这里可以添加实际的提交逻辑
    console.log('提交预约:', appState);
}

// 关闭模态框
function closeModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.remove('active');
    }
    
    // 返回首页
    showPage('home-page');
    
    // 重置状态
    appState.selectedDepartment = '';
    appState.selectedDoctor = '';
    appState.selectedDate = '';
    appState.selectedTime = '';
    appState.selectedPrice = 0;
}

// 取消预约
function cancelAppointment() {
    if (confirm('确定要取消这个预约吗？')) {
        alert('预约已取消');
        // 这里可以添加实际的取消逻辑
    }
}

// 查看详情
function viewDetails() {
    alert('预约详情功能开发中...');
}

// 搜索科室
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('dept-search');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const deptCards = document.querySelectorAll('.dept-card');
            
            deptCards.forEach(card => {
                const deptName = card.querySelector('h3').textContent.toLowerCase();
                if (deptName.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // 点击模态框背景关闭
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
});

// 初始化：设置默认选中今天
document.addEventListener('DOMContentLoaded', function() {
    const todayDateItem = document.querySelector('.date-item');
    if (todayDateItem) {
        const dateText = todayDateItem.querySelector('.date-date').textContent;
        appState.selectedDate = '今天';
        updateSummary('date', `今天 ${dateText}`);
    }
});
