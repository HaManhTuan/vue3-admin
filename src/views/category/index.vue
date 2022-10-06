<template>
  <div class="icons-container">
    <div>
      <el-row>
        <el-col :span="12" class="title-area">
          <h1 class="title">Category</h1>
          <el-button type="primary" class="btn-add" @click="openPopup"><i class="el-icon-plus"></i>Add</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="category-area">
      <el-row>
        <el-col :span="12">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="Name" />
            <el-table-column prop="description" label="Description" width="280"/>
            <el-table-column width="150" label="Action">
              <template #default="{row}">
                <el-button type="primary" @click="openPopup(row)"><i class="el-icon-edit"></i></el-button>
                <el-button type="danger" @click="deleteCategory(row.id)"><i class="el-icon-delete"></i></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row :gutter="24" class="text-center" style="padding: 30px 0;">
        <el-col :span="12">
          <el-pagination
            small
            background
            :current-page.sync="listQuery.current_page"
            :page-size="listQuery.per_page"
            layout="prev, pager, next"
            :total="listQuery.total"
            prev-text="◀"
            next-text="▶"
            @current-change="handleCurrentChange"
          />
        </el-col>
      </el-row>
      <el-dialog
        v-model="dialogVisible"
        :title="title"
        width="30%"
        :before-close="handleClose"
       >
        <template #default>
          <div>
            <el-form
              label-position="left"
              label-width="120px"
              :model="category"
            >
              <el-form-item label="Name" :error="errors.name">
                <el-input v-model="category.name" />
              </el-form-item>
              <el-form-item label="Description" :error="errors.description">
                <el-input v-model="category.description" />
              </el-form-item>
              <el-form-item label="Status">
                <el-switch v-model="category.status" />
              </el-form-item>
            </el-form>
          </div>
        </template>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="submitForm(isEdit)"
            >{{title}}</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import clipboard from '@/utils/clipboard'
import {getListCate, createCate, editCate, deleteCate} from "@/api/category";
import messageUtils from "@/mixins/messageUtils";
import { ElMessage, ElMessageBox } from 'element-plus'
import constants from "@/utils/constants";


export default {
  name: 'Category',
  mixins: [messageUtils],
  data() {
    return {
      dialogVisible: false,
      title: 'Add',
      tableData: [],
      category: {
        name: null,
        description: null,
        status: true
      },
      listQuery: {
        current_page: constants.PAGE,
        per_page: constants.PAGING,
        from: 0,
        to: 0,
        last_page: 0,
        total: undefined,
      },
      isEdit: false
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      getListCate(this.listQuery).then(response => {
        if(response.data.data) {
          this.tableData = response.data.data.data
          this.listQuery.current_page = response.data.data.pagination.current_page
          this.listQuery.from = response.data.data.pagination.from
          this.listQuery.last_page = response.data.data.pagination.last_page
          this.listQuery.per_page = response.data.data.pagination.per_page
          this.listQuery.to = response.data.data.pagination.to
          this.listQuery.total = response.data.data.pagination.total
        }
      }).catch((e) => {
          console.log('e:', e)
      })
    },
    openPopup(row = null) {
      if(row) {
        this.title = 'Edit'
        this.category = row
        this.category.status = Boolean(row.status)
        this.dialogVisible = true
        this.isEdit = true
      } else {
        this.title = 'Add'
        this.dialogVisible = true
      }
    },
    handleClose() {
      this.dialogVisible = false
      this.category = {
        name: null,
        description: null,
        status: true
      }
    },
    async handleCurrentChange(val) {
      this.listQuery.current_page = val
      await this.initData()
    },
    async submitForm(isEdit = null) {
      if(isEdit) {
        await editCate(this.category.id, this.category).then(async(res) => {
          if(res.data) {
            await this.initData()
            this.dialogVisible = false
            this.category = {
              name: null,
              description: null,
              status: true
            }
            this.isEdit = false
            ElMessage({
              message: 'Update Category successfully',
              type: 'success',
              duration: 3000
            })
          }
        }).catch((err) => {
          this.loading = false
          if (err.data.errors) this.errors = err.data.errors
        }).finally(() => {
          this.loading = false
        })
      } else {
        await createCate(this.category).then(async(res) => {
          if(res.data) {
            await this.initData()
            this.dialogVisible = false
            this.category = {
              name: null,
              description: null,
              status: true
            }
            ElMessage({
              message: 'Create Category successfully',
              type: 'success',
              duration: 3000
            })
          }
        }).catch((err) => {
          this.loading = false
          if (err.data.errors) this.errors = err.data.errors
        }).finally(() => {
          this.loading = false
        })
      }

    },
    deleteCategory(id) {
      ElMessageBox.confirm(
        'Proxy will permanently delete the file. Continue?',
        'Warning',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
      )
        .then(async() => {
          if(id) {
            await deleteCate(id).then(async(res) => {
              if(res.data) {
                await this.initData()
                ElMessage({
                  type: 'success',
                  message: 'Delete completed',
                  duration: 3000
                })
              }
            }).catch((err) => {
              this.loading = false
            }).finally(() => {
              this.loading = false
            })
          }
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: 'Delete canceled',
          })
        })
    }

  }
}
</script>

<style lang="scss" scoped>
.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;

  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .icon-item {
    margin: 20px;
    height: 85px;
    text-align: center;
    width: 100px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }

  .disabled {
    pointer-events: none;
  }
}
</style>
