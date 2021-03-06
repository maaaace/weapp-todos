Page({
  data: {
    personalInput: '',
    personalTodos: [],
    personalLeftCount: 0,
    personalAllCompleted: false,
    groupInput: '',
    groupTodos: [],
    groupLeftCount: 0,
    groupAllCompleted: false,
    logs: []
  },

  save: function () {
    var todo_list = {
      personalTodos: this.data.personalTodos,
      groupTodos: this.data.groupTodos
    };
    wx.setStorageSync('todo_list', todo_list)
    wx.setStorageSync('todo_logs', this.data.logs)
  },

  load: function () {
    var todos = wx.getStorageSync('todo_list')
    console.log(JSON.stringify(todos));
    if (todos && todos.personalTodos) {
      var personalLeftCount = 0, groupLeftCount = 0;
      if (todos.personalTodos) {
        personalLeftCount = todos.personalTodos.filter(function (item) {
          return !item.completed
        }).length
      }
      if(todos.groupTodos){
        groupLeftCount = todos.groupTodos.filter(function (item) {
          return !item.completed
        }).length
      }
      
      this.setData({ 
        personalTodos: todos.personalTodos, 
        personalLeftCount: personalLeftCount, 
        groupTodos: todos.groupTodos,
        groupLeftCount: groupLeftCount 
        });
    }
    var logs = wx.getStorageSync('todo_logs')
    if (logs) {
      this.setData({ logs: logs })
    }
  },

  onLoad: function () {
    this.load()
  },

  inputChangeHandle: function (e) {
    this.setData({ personalInput: e.detail.value })
  },

  addTodoHandle: function (e) {
    if (!this.data.personalInput || !this.data.personalInput.trim()) return
    var personalTodos = this.data.personalTodos
    personalTodos.push({ name: this.data.personalInput, completed: false })
    var logs = this.data.logs
    logs.push({ timestamp: new Date(), action: 'Personal-Add', name: this.data.personalInput })
    this.setData({
      personalInput: '',
      personalTodos: personalTodos,
      personalLeftCount: this.data.personalLeftCount + 1,
      logs: logs
    })
    this.save()
  },

  toggleTodoHandle: function (e) {
    var index = e.currentTarget.dataset.index
    var personalTodos = this.data.personalTodos
    personalTodos[index].completed = !personalTodos[index].completed
    var logs = this.data.logs
    logs.push({
      timestamp: new Date(),
      action: personalTodos[index].completed ? 'Personal-Finish' : 'Personal-Restart',
      name: personalTodos[index].name
    })
    this.setData({
      personalTodos: personalTodos,
      personalLeftCount: this.data.personalLeftCount + (personalTodos[index].completed ? -1 : 1),
      logs: logs
    })
    this.save()
  },

  removeTodoHandle: function (e) {
    var index = e.currentTarget.dataset.index
    var personalTodos = this.data.personalTodos
    var remove = personalTodos.splice(index, 1)[0]
    var logs = this.data.logs
    logs.push({ timestamp: new Date(), action: 'Personal-Remove', name: remove.name })
    this.setData({
      personalTodos: personalTodos,
      personalLeftCount: this.data.personalLeftCount - (remove.completed ? 0 : 1),
      logs: logs
    })
    this.save()
  },

  toggleAllHandle: function (e) {
    this.data.personalAllCompleted = !this.data.personalAllCompleted
    var personalTodos = this.data.personalTodos
    for (var i = personalTodos.length - 1; i >= 0; i--) {
      personalTodos[i].completed = this.data.personalAllCompleted
    }
    var logs = this.data.logs
    logs.push({
      timestamp: new Date(),
      action: this.data.personalAllCompleted ? 'Personal-Finish' : 'Personal-Restart',
      name: 'All todos'
    })
    this.setData({
      personalTodos: personalTodos,
      personalLeftCount: this.data.personalAllCompleted ? 0 : personalTodos.length,
      logs: logs
    })
    this.save()
  },
  
  clearCompletedHandle: function (e) {
    var personalTodos = this.data.personalTodos
    var remains = []
    for (var i = 0; i < personalTodos.length; i++) {
      personalTodos[i].completed || remains.push(personalTodos[i])
    }
    var logs = this.data.logs
    logs.push({
      timestamp: new Date(),
      action: 'Personal-Clear',
      name: 'Completed todo'
    })
    this.setData({ personalTodos: remains, logs: logs })
    this.save()
  },

  groupInputChangeHandle: function(e) {
    this.setData({ groupInput: e.detail.value })
  },

  addGroupTodoHandle: function(e) {
    if (!this.data.groupInput || !this.data.groupInput.trim()) return
    var groupTodos = this.data.groupTodos
    groupTodos.push({ name: this.data.groupInput, completed: false })
    var logs = this.data.logs
    logs.push({ timestamp: new Date(), action: 'Group-Add', name: this.data.groupInput })
    this.setData({
      groupInput: '',
      groupTodos: groupTodos,
      groupLeftCount: this.data.groupLeftCount + 1,
      logs: logs
    })
    this.save()
  },

  toggleGroupTodoHandle: function(e) {
    var index = e.currentTarget.dataset.index
    var groupTodos = this.data.groupTodos
    groupTodos[index].completed = !groupTodos[index].completed
    var logs = this.data.logs
    logs.push({
      timestamp: new Date(),
      action: groupTodos[index].completed ? 'Group-Finish' : 'Group-Restart',
      name: groupTodos[index].name
    })
    this.setData({
      groupTodos: groupTodos,
      groupLeftCount: this.data.groupLeftCount + (groupTodos[index].completed ? -1 : 1),
      logs: logs
    })
    this.save()
  },

  removeGroupTodoHandle: function(e) {
    var index = e.currentTarget.dataset.index
    var groupTodos = this.data.groupTodos
    var remove = groupTodos.splice(index, 1)[0]
    var logs = this.data.logs
    logs.push({ timestamp: new Date(), action: 'Group-Remove', name: remove.name })
    this.setData({
      groupTodos: groupTodos,
      groupLeftCount: this.data.groupLeftCount - (remove.completed ? 0 : 1),
      logs: logs
    })
    this.save()
  },

  toggleAllGroupHandle: function(e) {
    this.data.groupAllCompleted = !this.data.groupAllCompleted
    var groupTodos = this.data.groupTodos
    for (var i = groupTodos.length - 1; i >= 0; i--) {
      groupTodos[i].completed = this.data.groupAllCompleted
    }
    var logs = this.data.logs
    logs.push({
      timestamp: new Date(),
      action: this.data.groupAllCompleted ? 'Group-Finish' : 'Group-Restart',
      name: 'All todos'
    })
    this.setData({
      groupTodos: groupTodos,
      groupLeftCount: this.data.groupAllCompleted ? 0 : groupTodos.length,
      logs: logs
    })
    this.save()
  },

  clearGroupCompletedHandle: function(e) {
    var groupTodos = this.data.groupTodos
    var remains = []
    for (var i = 0; i < groupTodos.length; i++) {
      groupTodos[i].completed || remains.push(groupTodos[i])
    }
    var logs = this.data.logs
    logs.push({
      timestamp: new Date(),
      action: 'Group-Clear',
      name: 'Completed todo'
    })
    this.setData({ groupTodos: remains, logs: logs })
    this.save()
  }
})
