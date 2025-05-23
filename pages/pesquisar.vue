<template>
    <div class="space-y-10 m-10">
        <el-card class="box-card" shadow="hover">
            <el-form label-position="top" :model="params" :rules="rules" ref="form">
                <el-row :gutter="10">
                    <el-col class="mt-2" :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                        <el-form-item label="Categoria" required prop="categoria">
                            <el-select size="large" v-model="params.categoria" placeholder="Selecione">
                                <el-option v-for="item in categorias" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-2" :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                        <el-form-item label="Data">
                            <el-date-picker size="large" style="width:100%" v-model="date" type="datetimerange"
                                range-separator="a" start-placeholder="Data inicial" end-placeholder="Data final"
                                value-format="YYYY-MM-DDTHH:mm:ss" @change="formatDate"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-2" :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                        <el-form-item label="SSID">
                            <el-select size="large" v-model="params.ssid" placeholder="Selecione">
                                <el-option v-for="item in ssids" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="params.categoria != 'associacao'" class="mt-2" :xs="24" :sm="24" :md="12" :lg="12"
                        :xl="8">
                        <el-form-item label="Usuário">
                            <el-input size="large" v-model="params.usuario"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-2">
                        <el-button @click="cleanParams()" size="large">Limpar</el-button>
                        <el-button @click="submitForm('form')" size="large" type="primary">Pesquisar</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>

        <el-card class="box-card" shadow="hover">
            <el-table v-loading="loading" v-if="params.categoria == 'autenticacao'" :data="list" style="width: 100%">
                <el-table-column prop="authApName" label="AP" />
                <el-table-column prop="authUserName" label="User" />
                <el-table-column prop="datetime" label="Hora" />
                <el-table-column prop="authSsid" label="SSID" />
                <el-table-column prop="authResult" label="Result" />
            </el-table>
            <el-table v-loading="loading" v-if="params.categoria == 'handshake'" :data="list" style="width: 100%">
                <el-table-column prop="hsApName" label="AP" />
                <el-table-column prop="hsUserName" label="User" />
                <el-table-column prop="datetime" label="Hora" />
                <el-table-column prop="hsSsid" label="SSID" />
                <el-table-column prop="hsResult" label="Result" />
            </el-table>
            <el-table v-loading="loading" v-if="params.categoria == 'associacao'" :data="list" style="width: 100%">
                <el-table-column prop="assocApName" label="AP" />
                <el-table-column prop="assocUserName" label="User" />
                <el-table-column prop="datetime" label="Hora" />
                <el-table-column prop="assocSsid" label="SSID" />
                <el-table-column prop="assocResult" label="Result" />
            </el-table>
        </el-card>

        <el-pagination :page-sizes="[10, 50, 100]" :page-size="params.limit" background :current-page.sync="params.page"
        layout="sizes, prev, pager, next" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            date: [],
            params: {
                usuario: '',
                categoria: '',
                ssid: '',
                dataInicio: '',
                dataFim: '',
                page: 1,
                limit: 10
            },
            total: 0,
            ssids: [
                { value: 'UTFPR-SERVIDOR', label: 'UTFPR-SERVIDOR' },
                { value: 'UTFPR-ALUNO', label: 'UTFPR-ALUNO' },
                { value: 'UTFPR-VISITANTE', label: 'UTFPR-VISITANTE' }
            ],
            categorias: [
                { value: 'autenticacao', label: 'Autenticação' },
                { value: 'associacao', label: 'Associação' },
                { value: 'handshake', label: 'Handshake' },
            ],
            list: [],
            activeIndex: '1',
            rules: {
                categoria: [
                    { required: true, message: 'Selecione uma categoria!', trigger: 'change' },
                ],
            },
            loading: false,
        };
    },
    methods: {
        formatDate(date) {
            if (date && date.length === 2) {
                const dataIniUtc = new Date(date[0]).toISOString();
                this.params.dataInicio = dataIniUtc;

                const dataFimUtc = new Date(date[1]).toISOString();
                this.params.dataFim = dataFimUtc;

                console.log('datas', this.params);


            } else {
                this.params.dataInicio = undefined;
                this.params.dataFim = undefined;
            }
            console.log(this.params);
        },
        cleanParams() {
            this.params = {
                usuario: '',
                categoria: '',
                ssid: '',
            }
            this.date = []
        },
        handleSizeChange(data) {
            console.log(data);
            this.params.limit = data
            this.fetchHandshakes(this.params)
        },
        handleCurrentChange(data) {
            this.params.page = data
            this.fetchHandshakes(this.params)
            console.log(data);
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (!this.params.ssid) delete this.params.ssid;
                    if (!this.params.usuario) delete this.params.usuario;

                    switch (this.params.categoria) {
                        case 'handshake':
                            this.fetchHandshakes(this.params);
                            break;
                        case 'autenticacao':
                            this.fetchAuthentications(this.params);
                            break;
                        case 'associacao':
                            this.fetchAssociations(this.params);
                            break;
                        default:
                            break;
                    }
                }
            });
        },
        fetchHandshakes(params) {
            this.loading = true;
            axios.get('http://localhost:3000/handshake', { params })
                .then((response) => {
                    console.log('response', response);
                    this.list = response.data.data;
                    this.total = response.data.total
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        fetchAssociations() { },
        fetchAuthentications() { }
    }
};
</script>