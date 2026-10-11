document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY_TASKS = 'tugas_naila_tasks_data';
  const STORAGE_KEY_AUTH = 'tugas_naila_is_admin';
  const DEFAULT_ADMIN_PASSWORD = 'admin123';

  const INITIAL_SEED_TASKS = [
    {
      id: 'task-seed-1',
      meeting: '1',
      title: 'Membuat Website Portofolio',
      description: 'Membuat website portofolio pribadi responsif menggunakan HTML, CSS, dan JavaScript dasar.',
      status: 'completed',
      methodType: 'link',
      method: 'Kirim Link (Google Drive / Web)',
      link: 'https://github.com',
      createdAt: Date.now() - 86400000 * 3
    },
    {
      id: 'task-seed-2',
      meeting: '2',
      title: 'Membuat Halaman Profil Diri',
      description: 'Membuat halaman profil diri menggunakan HTML5',
      status: 'completed',
      methodType: 'link',
      method: 'Kirim Link (Google Drive / Web)',
      link: 'profil/index.html',
      createdAt: Date.now() - 86400000 * 2
    },
    {
      id: 'task-seed-3',
      meeting: '3',
      title: 'Implementasi API & Basis Data Mahasiswa',
      description: 'Mengintegrasikan penyimpanan data lokal/API dan manajemen tugas dengan validasi form lengkap.',
      status: 'pending',
      methodType: 'link',
      method: 'Kirim Link (Google Drive / Web)',
      link: 'https://drive.google.com',
      createdAt: Date.now() - 86400000 * 1
    }
  ];

  let tasks = loadTasksFromStorage();
  let isAdmin = sessionStorage.getItem(STORAGE_KEY_AUTH) === 'true';
  let currentFilter = 'all'; // 'all' | 'completed' | 'pending'
  let pendingDeleteTaskId = null;
  let currentUploadedFile = null;

  // Navbar
  const btnOpenLoginModal = document.getElementById('btnOpenLoginModal');
  const adminActionGroup = document.getElementById('adminActionGroup');
  const btnOpenAddTaskModal = document.getElementById('btnOpenAddTaskModal');
  const btnLogout = document.getElementById('btnLogout');
  const adminBadge = document.getElementById('adminBadge');

  // Filter Pills
  const filterAll = document.getElementById('filterAll');
  const filterCompleted = document.getElementById('filterCompleted');
  const filterPending = document.getElementById('filterPending');
  const countAll = document.getElementById('countAll');
  const countCompleted = document.getElementById('countCompleted');
  const countPending = document.getElementById('countPending');

  // Tasks Area
  const tasksGrid = document.getElementById('tasksGrid');
  const emptyStateCard = document.getElementById('emptyStateCard');
  const emptyTitle = document.getElementById('emptyTitle');
  const emptyDesc = document.getElementById('emptyDesc');
  const emptyAdminAction = document.getElementById('emptyAdminAction');
  const btnEmptyAddTask = document.getElementById('btnEmptyAddTask');

  // Modal Login Admin
  const loginModal = document.getElementById('loginModal');
  const loginForm = document.getElementById('loginForm');
  const adminPasswordInput = document.getElementById('adminPasswordInput');
  const btnTogglePassword = document.getElementById('btnTogglePassword');
  const eyeOpenIcon = document.getElementById('eyeOpenIcon');
  const eyeClosedIcon = document.getElementById('eyeClosedIcon');
  const loginErrorMsg = document.getElementById('loginErrorMsg');
  const btnBackFromLogin = document.getElementById('btnBackFromLogin');

  // Modal Tambah Tugas
  const addTaskModal = document.getElementById('addTaskModal');
  const addTaskForm = document.getElementById('addTaskForm');
  const taskMeetingInput = document.getElementById('taskMeeting');
  const taskTitleInput = document.getElementById('taskTitle');
  const taskDescInput = document.getElementById('taskDesc');
  const taskStatusSelect = document.getElementById('taskStatus');
  const taskMethodSelect = document.getElementById('taskMethod');
  const linkInputGroup = document.getElementById('linkInputGroup');
  const taskLinkLabel = document.getElementById('taskLinkLabel');
  const taskLinkInput = document.getElementById('taskLink');
  
  // File Upload Elements
  const fileInputGroup = document.getElementById('fileInputGroup');
  const fileDropzone = document.getElementById('fileDropzone');
  const taskFileInput = document.getElementById('taskFileInput');
  const fileUploadPrompt = document.getElementById('fileUploadPrompt');
  const fileChosenPreview = document.getElementById('fileChosenPreview');
  const chosenFileName = document.getElementById('chosenFileName');
  const chosenFileSize = document.getElementById('chosenFileSize');
  const btnRemoveFile = document.getElementById('btnRemoveFile');
  const btnCancelAddTask = document.getElementById('btnCancelAddTask');

  // Modal Konfirmasi Hapus
  const deleteConfirmModal = document.getElementById('deleteConfirmModal');
  const btnCancelDelete = document.getElementById('btnCancelDelete');
  const btnConfirmDelete = document.getElementById('btnConfirmDelete');

  // Toast Container
  const toastContainer = document.getElementById('toastContainer');

  function loadTasksFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_TASKS);
      if (data) {
        let parsed = JSON.parse(data);
        // Pastikan tugas Pertemuan 2 selalu selaras dengan halaman profil (profil/index.html)
        parsed = parsed.map(t => {
          if (t.id === 'task-seed-2' || t.meeting === '2') {
            return {
              ...t,
              meeting: '2',
              title: 'Membuat Halaman Profil Diri',
              description: 'Membuat halaman profil diri menggunakan HTML5',
              status: 'completed',
              methodType: 'link',
              method: 'Kirim Link (Google Drive / Web)',
              link: 'profil/index.html'
            };
          }
          return t;
        });
        saveTasksToStorage(parsed);
        return parsed;
      }
    } catch (e) {
      console.warn('Gagal membaca localStorage, menggunakan data seed default:', e);
    }
    saveTasksToStorage(INITIAL_SEED_TASKS);
    return [...INITIAL_SEED_TASKS];
  }

  function saveTasksToStorage(data) {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(data));
    } catch (e) {
      console.error('Gagal menyimpan tugas ke localStorage:', e);
    }
  }

  function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }


  function updateAuthUI() {
    if (isAdmin) {
      // Sembunyikan tombol 'Admin Login'
      btnOpenLoginModal.classList.add('hidden');
      // Tampilkan tombol '+ Tambah Tugas' dan 'Logout'
      adminActionGroup.classList.remove('hidden');
      // Tampilkan badge status admin di profil
      adminBadge.classList.remove('hidden');
      if (emptyAdminAction) emptyAdminAction.classList.remove('hidden');
    } else {
      // Tampilkan tombol 'Admin Login'
      btnOpenLoginModal.classList.remove('hidden');
      // Sembunyikan kontrol admin di navbar
      adminActionGroup.classList.add('hidden');
      // Sembunyikan badge status admin
      adminBadge.classList.add('hidden');
      if (emptyAdminAction) emptyAdminAction.classList.add('hidden');
    }

    // Render ulang kartu tugas agar tombol hapus & metadata menyesuaikan mode
    renderTasks();
  }

  function handleLogin(password) {
    if (password === DEFAULT_ADMIN_PASSWORD) {
      isAdmin = true;
      sessionStorage.setItem(STORAGE_KEY_AUTH, 'true');
      loginErrorMsg.classList.add('hidden');
      loginPasswordReset();
      closeModal(loginModal);
      updateAuthUI();
      showToast('Berhasil login sebagai Admin!', 'success');
    } else {
      loginErrorMsg.classList.remove('hidden');
      adminPasswordInput.classList.add('input-error');
      adminPasswordInput.focus();
      showToast('Password salah. Silakan coba lagi.', 'error');
    }
  }

  function handleLogout() {
    isAdmin = false;
    sessionStorage.removeItem(STORAGE_KEY_AUTH);
    updateAuthUI();
    showToast('Berhasil logout dari mode Admin.', 'info');
  }

  function loginPasswordReset() {
    adminPasswordInput.value = '';
    adminPasswordInput.type = 'password';
    eyeOpenIcon.classList.remove('hidden');
    eyeClosedIcon.classList.add('hidden');
    loginErrorMsg.classList.add('hidden');
  }

  // =========================================================================
  // DYNAMIC METHOD SELECTOR & FILE UPLOAD
  // =========================================================================

  function updateMethodInputView() {
    const selected = taskMethodSelect.value;
    if (selected === 'file') {
      linkInputGroup.classList.add('hidden');
      fileInputGroup.classList.remove('hidden');
      taskLinkInput.removeAttribute('required');
    } else {
      linkInputGroup.classList.remove('hidden');
      fileInputGroup.classList.add('hidden');
      taskLinkInput.setAttribute('required', 'true');

      if (selected === 'github') {
        taskLinkLabel.textContent = 'Link Repositori GitHub';
        taskLinkInput.placeholder = 'https://github.com/...';
      } else {
        taskLinkLabel.textContent = 'Link Tugas';
        taskLinkInput.placeholder = 'https://...';
      }
    }
  }

  function resetAddTaskForm() {
    addTaskForm.reset();
    taskMethodSelect.value = 'link';
    updateMethodInputView();
    taskFileInput.value = '';
    currentUploadedFile = null;
    fileChosenPreview.classList.add('hidden');
    fileUploadPrompt.classList.remove('hidden');
  }

  // Klik area dropzone memicu input file
  fileDropzone.addEventListener('click', (e) => {
    if (e.target.closest('#btnRemoveFile')) return;
    taskFileInput.click();
  });

  taskFileInput.addEventListener('change', () => {
    if (taskFileInput.files && taskFileInput.files[0]) {
      const file = taskFileInput.files[0];
      // Validasi ukuran maks 5MB
      if (file.size > 5 * 1024 * 1024) {
        showToast('Ukuran file maksimal adalah 5MB.', 'error');
        taskFileInput.value = '';
        currentUploadedFile = null;
        return;
      }
      currentUploadedFile = file;
      chosenFileName.textContent = file.name;
      chosenFileSize.textContent = formatBytes(file.size);
      fileUploadPrompt.classList.add('hidden');
      fileChosenPreview.classList.remove('hidden');
    }
  });

  btnRemoveFile.addEventListener('click', (e) => {
    e.stopPropagation();
    taskFileInput.value = '';
    currentUploadedFile = null;
    fileChosenPreview.classList.add('hidden');
    fileUploadPrompt.classList.remove('hidden');
  });

  taskMethodSelect.addEventListener('change', updateMethodInputView);

  // =========================================================================
  // TASK CRUD OPERATIONS
  // =========================================================================

  function addTask(taskData) {
    const newTask = {
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      meeting: taskData.meeting.trim(),
      title: taskData.title.trim(),
      description: taskData.description.trim(),
      status: taskData.status,
      methodType: taskData.methodType || 'link',
      method: taskData.method,
      fileName: taskData.fileName || '',
      fileSize: taskData.fileSize || '',
      link: taskData.methodType === 'file' ? taskData.link : sanitizeUrl(taskData.link.trim()),
      createdAt: Date.now()
    };

    tasks.unshift(newTask);
    saveTasksToStorage(tasks);
    renderTasks();
    showToast(`Tugas Pertemuan ${newTask.meeting} berhasil disimpan!`, 'success');
  }

  function deleteTask(id) {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex !== -1) {
      const removed = tasks.splice(taskIndex, 1)[0];
      saveTasksToStorage(tasks);
      renderTasks();
      showToast(`Tugas "${removed.title}" berhasil dihapus.`, 'info');
    }
  }

  function sanitizeUrl(rawUrl) {
    if (!rawUrl) return '#';
    if (!/^https?:\/\//i.test(rawUrl)) {
      return 'https://' + rawUrl;
    }
    return rawUrl;
  }

  // =========================================================================
  // RENDERING & FILTERING
  // =========================================================================

  function getFilteredTasks() {
    if (currentFilter === 'completed') {
      return tasks.filter(t => t.status === 'completed');
    }
    if (currentFilter === 'pending') {
      return tasks.filter(t => t.status === 'pending');
    }
    return tasks;
  }

  function updateFilterCounts() {
    const totalCount = tasks.length;
    const completedCount = tasks.filter(t => t.status === 'completed').length;
    const pendingCount = tasks.filter(t => t.status === 'pending').length;

    countAll.textContent = totalCount;
    countCompleted.textContent = completedCount;
    countPending.textContent = pendingCount;
  }

  function renderTasks() {
    updateFilterCounts();
    const filteredTasks = getFilteredTasks();

    // Reset grid
    tasksGrid.innerHTML = '';

    if (filteredTasks.length === 0) {
      // Tampilkan Empty State
      tasksGrid.classList.add('hidden');
      emptyStateCard.classList.remove('hidden');

      if (tasks.length === 0) {
        emptyTitle.textContent = 'Belum Ada Tugas Ditambahkan';
        emptyDesc.textContent = 'Koleksi tugas kuliah yang diunggah oleh admin akan tersusun rapi di area ini.';
      } else if (currentFilter === 'completed') {
        emptyTitle.textContent = 'Belum Ada Tugas Selesai';
        emptyDesc.textContent = 'Semua tugas yang telah Anda selesaikan akan dikelompokkan di sini.';
      } else if (currentFilter === 'pending') {
        emptyTitle.textContent = 'Tidak Ada Tugas Belum Selesai';
        emptyDesc.textContent = 'Hebat! Semua tugas kuliah sudah diselesaikan.';
      }
      return;
    }

    // Ada tugas untuk ditampilkan
    emptyStateCard.classList.add('hidden');
    tasksGrid.classList.remove('hidden');

    filteredTasks.forEach(task => {
      const cardEl = createTaskCardElement(task);
      tasksGrid.appendChild(cardEl);
    });
  }

  function createTaskCardElement(task) {
    const card = document.createElement('article');
    card.className = 'task-card';
    card.setAttribute('data-id', task.id);

    const isDone = task.status === 'completed';
    const statusLabel = isDone ? 'Selesai' : 'Belum Dikerjakan';
    const statusClass = isDone ? 'completed' : 'pending';

    // Bagian Admin Delete Button (Hanya tampil jika isAdmin)
    const adminDeleteButtonHtml = isAdmin ? `
      <button 
        type="button" 
        class="btn-delete-task" 
        data-delete-id="${task.id}" 
        title="Hapus Tugas Ini"
        aria-label="Hapus tugas ${escapeHtml(task.title)}"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    ` : '';

    // KETENTUAN KHUSUS: Box info metode "(Kirim Link)" HANYA muncul pada mode Admin.
    // Pada mode Pengunjung biasa / Bukan Admin, baris info ini TIDAK ditampilkan.
    let methodMetaHtml = '';
    if (isAdmin) {
      const isFile = task.methodType === 'file';
      const labelText = isFile ? `Dokumen: ${task.fileName || 'Berkas Terlampir'}` : (task.method || 'Kirim Link');
      const iconSvg = isFile ? `
        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
      ` : `
        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
      `;

      methodMetaHtml = `
        <div class="task-meta-method">
          ${iconSvg}
          <span>${escapeHtml(labelText)}</span>
        </div>
      `;
    }

    // Konfigurasi tombol Buka Tugas: jika dokumen file terupload, set attribute download
    const isFileTask = task.methodType === 'file' && task.link;
    const downloadAttr = isFileTask && task.fileName ? `download="${escapeHtml(task.fileName)}"` : '';

    card.innerHTML = `
      <div class="task-card-header">
        <span class="badge-meeting">Pertemuan ${escapeHtml(task.meeting)}</span>
        <span class="badge-status ${statusClass}">
          <span class="badge-status-dot"></span>
          <span>${statusLabel}</span>
        </span>
      </div>

      <div class="task-card-body">
        <h3 class="task-title">${escapeHtml(task.title)}</h3>
        <p class="task-description">${escapeHtml(task.description)}</p>
        ${methodMetaHtml}
      </div>

      <div class="task-card-footer">
        <a 
          href="${escapeHtml(task.link)}" 
          target="_blank" 
          rel="noopener noreferrer" 
          ${downloadAttr}
          class="btn-open-task"
        >
          <span>Buka Tugas ↗</span>
        </a>
        ${adminDeleteButtonHtml}
      </div>
    `;

    // Pasang event listener untuk tombol hapus jika ada
    if (isAdmin) {
      const deleteBtn = card.querySelector('.btn-delete-task');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
          promptDeleteTask(task.id, task.title);
        });
      }
    }

    return card;
  }

  function promptDeleteTask(id, title) {
    pendingDeleteTaskId = id;
    const deleteDesc = document.getElementById('deleteConfirmDesc');
    if (deleteDesc) {
      deleteDesc.textContent = `Apakah Anda yakin ingin menghapus tugas "${title}"? Tindakan ini tidak dapat dibatalkan.`;
    }
    openModal(deleteConfirmModal);
  }

  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // =========================================================================
  // MODAL CONTROLS & LIGHT DISMISS FALLBACK
  // =========================================================================

  function openModal(dialog) {
    if (!dialog) return;
    dialog.showModal();
    // Trap focus inside modal gracefully
    const firstInput = dialog.querySelector('input, button:not([disabled])');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 50);
    }
  }

  function closeModal(dialog) {
    if (!dialog) return;
    dialog.close();
  }

  // Setup Light-Dismiss Fallback untuk browser yang belum mendukung <dialog closedby="any">
  const allDialogs = document.querySelectorAll('dialog');
  allDialogs.forEach(dialog => {
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      dialog.addEventListener('click', (event) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        if (isDialogContent) return;
        dialog.close();
      });
    }
  });

  // =========================================================================
  // TOAST NOTIFICATIONS
  // =========================================================================

  function showToast(message, type = 'info') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-out');
      setTimeout(() => {
        toast.remove();
      }, 200);
    }, 3200);
  }

  // =========================================================================
  // EVENT LISTENERS
  // =========================================================================

  // --- Filter Pills Clicks ---
  [filterAll, filterCompleted, filterPending].forEach(pill => {
    pill.addEventListener('click', () => {
      [filterAll, filterCompleted, filterPending].forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.getAttribute('data-filter');
      renderTasks();
    });
  });

  // --- Modal Login Admin Events ---
  btnOpenLoginModal.addEventListener('click', () => {
    loginPasswordReset();
    openModal(loginModal);
    setTimeout(() => adminPasswordInput.focus(), 60);
  });

  btnBackFromLogin.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(loginModal);
  });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = adminPasswordInput.value.trim();
    if (!val) {
      loginErrorMsg.textContent = 'Password tidak boleh kosong.';
      loginErrorMsg.classList.remove('hidden');
      return;
    }
    handleLogin(val);
  });

  // Eye toggle password visibility
  btnTogglePassword.addEventListener('click', () => {
    if (adminPasswordInput.type === 'password') {
      adminPasswordInput.type = 'text';
      eyeOpenIcon.classList.add('hidden');
      eyeClosedIcon.classList.remove('hidden');
    } else {
      adminPasswordInput.type = 'password';
      eyeOpenIcon.classList.remove('hidden');
      eyeClosedIcon.classList.add('hidden');
    }
  });

  // --- Admin Logout ---
  btnLogout.addEventListener('click', () => {
    handleLogout();
  });

  // --- Modal Tambah Tugas Events ---
  btnOpenAddTaskModal.addEventListener('click', () => {
    resetAddTaskForm();
    openModal(addTaskModal);
    setTimeout(() => taskMeetingInput.focus(), 60);
  });

  btnEmptyAddTask.addEventListener('click', () => {
    resetAddTaskForm();
    openModal(addTaskModal);
    setTimeout(() => taskMeetingInput.focus(), 60);
  });

  btnCancelAddTask.addEventListener('click', () => {
    closeModal(addTaskModal);
    resetAddTaskForm();
  });

  addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const meeting = taskMeetingInput.value.trim();
    const title = taskTitleInput.value.trim();
    const desc = taskDescInput.value.trim();
    const status = taskStatusSelect.value;
    const methodKey = taskMethodSelect.value;

    if (!meeting || !title || !desc) {
      showToast('Harap lengkapi pertemuan, judul, dan deskripsi.', 'error');
      return;
    }

    if (methodKey === 'file') {
      if (!currentUploadedFile) {
        showToast('Silakan pilih file dokumen terlebih dahulu.', 'error');
        return;
      }

      // Baca file sebagai base64 DataURL
      const reader = new FileReader();
      reader.onload = function(evt) {
        const base64Data = evt.target.result;
        addTask({
          meeting,
          title,
          description: desc,
          status,
          methodType: 'file',
          method: 'Upload File Dokumen',
          fileName: currentUploadedFile.name,
          fileSize: formatBytes(currentUploadedFile.size),
          link: base64Data
        });

        closeModal(addTaskModal);
        resetAddTaskForm();
      };
      reader.onerror = function() {
        showToast('Terjadi kesalahan saat membaca file.', 'error');
      };
      reader.readAsDataURL(currentUploadedFile);

    } else {
      const link = taskLinkInput.value.trim();
      if (!link) {
        showToast('Harap masukkan link tugas yang valid.', 'error');
        return;
      }

      const methodLabel = methodKey === 'github' ? 'Repositori GitHub' : 'Kirim Link (Google Drive / Web)';
      addTask({
        meeting,
        title,
        description: desc,
        status,
        methodType: 'link',
        method: methodLabel,
        link
      });

      closeModal(addTaskModal);
      resetAddTaskForm();
    }
  });

  btnCancelDelete.addEventListener('click', () => {
    pendingDeleteTaskId = null;
    closeModal(deleteConfirmModal);
  });

  btnConfirmDelete.addEventListener('click', () => {
    if (pendingDeleteTaskId) {
      deleteTask(pendingDeleteTaskId);
      pendingDeleteTaskId = null;
    }
    closeModal(deleteConfirmModal);
  });

  updateAuthUI();
  updateMethodInputView();
  renderTasks();
});
