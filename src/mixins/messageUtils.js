const messageUtils = {
  data() {
    return {
      errors: {}
    }
  },
  methods: {
    clearMessage(field) {
      if (field) {
        this.$delete(this.errors, field)
      } else {
        this.errors = {}
      }
    },
    updateMessage(data) {
      this.clearMessage()
      const errors = {}
      Object.keys(data).forEach(key => {
        if (Array.isArray(data[key])) {
          errors[key] = data[key][0]
        } else if (typeof (data[key]) === 'object') {
          errors[key] = data[key][Object.keys(data[key])[0]][0]
        }
      })
      if (data['non_field_errors']) errors['message'] = data['non_field_errors'][0]
      this.errors = errors
    }
  }
}

export default messageUtils
