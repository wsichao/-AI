// 全局状态管理
const appState = {
    selectedDepartment: '',
    selectedDoctor: '',
    selectedDoctorTitle: '',
    selectedDate: '',
    selectedTime: '',
    appointments: JSON.parse(localStorage.getItem('appointments') || '[]')
};

// 页面切换函数
function showPage(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // 显示目标页面
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // 根据页面ID执行特定初始化
        if (pageId === 'doctor-page') {
            updateDoctorPageTitle();
        } else if (pageId === 'time-page') {
            initializeTimePage();
        } else if (pageId === 'confirm-page') {
            updateConfirmPage();
        } else if (pageId === 'appointments-page') {
            renderAppointments();
        }
    }
}

// 选择科室
function selectDepartment(dept, currentPage) {
    appState.selectedDepartment = dept;
    showPage('doctor-page');
}

// 更新医生页面标题
function updateDoctorPageTitle() {
    const title = document.getElementById('doctor-page-title');
    if (title && appState.selectedDepartment) {
        title.textContent = `${appState.selectedDepartment} - 选择医生`;
    }
}

// 选择医生
function selectDoctor(name, title, currentPage) {
    appState.selectedDoctor = name;
    appState.selectedDoctorTitle = title;
    showPage('time-page');
}

// 初始化时间选择页面
function initializeTimePage() {
    // 更新显示信息
    document.getElementById('selected-dept-display').textContent = appState.selectedDepartment;
    document.getElementById('selected-doctor-display').textContent = 
        `${appState.selectedDoctor} (${appState.selectedDoctorTitle})`;
    
    // 生成日期选项（未来7天）
    generateDateOptions();
    
    // 生成时间段选项
    generateTimeSlots();
    
    // 重置选择
    appState.selectedDate = '';
    appState.selectedTime = '';
    document.getElementById('confirm-time-btn').disabled = true;
}

// 生成日期选项
function generateDateOptions() {
    const datePicker = document.getElementById('date-picker');
    datePicker.innerHTML = '';
    
    const today = new Date();
    const days = ['今天', '明天', '后天'];
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const dateItem = document.createElement('div');
        dateItem.className = 'date-item';
        if (i === 0) {
            dateItem.classList.add('selected');
            appState.selectedDate = formatDate(date);
        }
        
        dateItem.innerHTML = `
            <div class="date-day">${i < 3 ? days[i] : getWeekday(date)}</div>
            <div class="date-number">${date.getDate()}</div>
        `;
        
        dateItem.onclick = () => selectDate(date, dateItem);
        datePicker.appendChild(dateItem);
    }
}

// 选择日期
function selectDate(date, element) {
    // 移除所有选中状态
    document.querySelectorAll('.date-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // 添加选中状态
    element.classList.add('selected');
    appState.selectedDate = formatDate(date);
    
    // 重新生成时间段（不同日期可能有不同的时间段）
    generateTimeSlots();
    
    // 检查是否可以确认
    checkTimeSelection();
}

// 格式化日期
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 获取星期
function getWeekday(date) {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekdays[date.getDay()];
}

// 生成时间段选项
function generateTimeSlots() {
    const timeSlots = document.getElementById('time-slots');
    timeSlots.innerHTML = '';
    
    // 时间段配置
    const slots = [
        { time: '08:00-09:00', available: true },
        { time: '09:00-10:00', available: true },
        { time: '10:00-11:00', available: true },
        { time: '11:00-12:00', available: false },
        { time: '14:00-15:00', available: true },
        { time: '15:00-16:00', available: true },
        { time: '16:00-17:00', available: true }
    ];
    
    slots.forEach(slot => {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        timeSlot.textContent = slot.time;
        
        if (!slot.available) {
            timeSlot.classList.add('disabled');
        } else {
            timeSlot.onclick = () => selectTime(slot.time, timeSlot);
        }
        
        timeSlots.appendChild(timeSlot);
    });
}

// 选择时间段
function selectTime(time, element) {
    // 移除所有选中状态
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // 添加选中状态
    element.classList.add('selected');
    appState.selectedTime = time;
    
    // 检查是否可以确认
    checkTimeSelection();
}

// 检查时间选择是否完整
function checkTimeSelection() {
    const btn = document.getElementById('confirm-time-btn');
    if (appState.selectedDate && appState.selectedTime) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}

// 更新确认页面
function updateConfirmPage() {
    document.getElementById('confirm-dept').textContent = appState.selectedDepartment;
    document.getElementById('confirm-doctor').textContent = 
        `${appState.selectedDoctor} (${appState.selectedDoctorTitle})`;
    document.getElementById('confirm-date').textContent = formatDateDisplay(appState.selectedDate);
    document.getElementById('confirm-time').textContent = appState.selectedTime;
    
    // 清空输入框
    document.getElementById('patient-name').value = '';
    document.getElementById('patient-phone').value = '';
}

// 格式化日期显示
function formatDateDisplay(dateStr) {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = getWeekday(date);
    return `${month}月${day}日 ${weekday}`;
}

// 提交预约
function submitAppointment() {
    const patientName = document.getElementById('patient-name').value.trim();
    const patientPhone = document.getElementById('patient-phone').value.trim();
    
    // 简单验证
    if (!patientName) {
        alert('请输入就诊人姓名');
        return;
    }
    
    if (!patientPhone) {
        alert('请输入联系电话');
        return;
    }
    
    if (!/^1[3-9]\d{9}$/.test(patientPhone)) {
        alert('请输入正确的手机号码');
        return;
    }
    
    // 创建预约记录
    const appointment = {
        id: Date.now(),
        department: appState.selectedDepartment,
        doctor: appState.selectedDoctor,
        doctorTitle: appState.selectedDoctorTitle,
        date: appState.selectedDate,
        time: appState.selectedTime,
        patientName: patientName,
        patientPhone: patientPhone,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    // 保存到本地存储
    appState.appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appState.appointments));
    
    // 显示成功提示
    showSuccessModal();
    
    // 重置状态
    resetAppointmentState();
}

// 显示成功模态框
function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    modal.classList.add('active');
}

// 关闭模态框
function closeModal() {
    const modal = document.getElementById('success-modal');
    modal.classList.remove('active');
    // 返回首页
    showPage('home-page');
}

// 重置预约状态
function resetAppointmentState() {
    appState.selectedDepartment = '';
    appState.selectedDoctor = '';
    appState.selectedDoctorTitle = '';
    appState.selectedDate = '';
    appState.selectedTime = '';
}

// 渲染预约记录
function renderAppointments() {
    const appointmentsList = document.getElementById('appointments-list');
    
    if (appState.appointments.length === 0) {
        appointmentsList.innerHTML = '<div class="empty-state"><p>暂无预约记录</p></div>';
        return;
    }
    
    // 按创建时间倒序排列
    const sortedAppointments = [...appState.appointments].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    appointmentsList.innerHTML = sortedAppointments.map(appointment => {
        const statusText = {
            'pending': '待确认',
            'confirmed': '已确认',
            'cancelled': '已取消'
        };
        
        const statusClass = {
            'pending': 'status-pending',
            'confirmed': 'status-confirmed',
            'cancelled': 'status-cancelled'
        };
        
        return `
            <div class="appointment-record">
                <div class="appointment-record-header">
                    <h3>${appointment.department}</h3>
                    <span class="appointment-status ${statusClass[appointment.status]}">
                        ${statusText[appointment.status]}
                    </span>
                </div>
                <div class="appointment-details">
                    <p><strong>医生：</strong>${appointment.doctor} (${appointment.doctorTitle})</p>
                    <p><strong>日期：</strong>${formatDateDisplay(appointment.date)}</p>
                    <p><strong>时间：</strong>${appointment.time}</p>
                    <p><strong>就诊人：</strong>${appointment.patientName}</p>
                    <p><strong>联系电话：</strong>${appointment.patientPhone}</p>
                </div>
                ${appointment.status === 'pending' ? `
                    <div class="appointment-actions">
                        <button class="btn-secondary" onclick="cancelAppointment(${appointment.id})">
                            取消预约
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

// 取消预约
function cancelAppointment(id) {
    if (confirm('确定要取消这个预约吗？')) {
        const index = appState.appointments.findIndex(apt => apt.id === id);
        if (index !== -1) {
            appState.appointments[index].status = 'cancelled';
            localStorage.setItem('appointments', JSON.stringify(appState.appointments));
            renderAppointments();
        }
    }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 确保首页显示
    showPage('home-page');
    
    // 点击模态框背景关闭
    const modal = document.getElementById('success-modal');
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
});
