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
                    <el-col class="mt-2" :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                        <el-form-item label="Nome AP">
                            <el-input placeholder="Digite um nome de AP" size="large"
                                v-model="params.apName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col class="mt-2" :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                        <el-form-item label="MAC de Usuário">
                            <el-input placeholder="Digite um MAC de usuário" size="large" v-model="params.userMac"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="params.categoria != 'associacao'" class="mt-2" :xs="24" :sm="24" :md="12" :lg="12"
                        :xl="8">
                        <el-form-item label="Usuário">
                            <el-input placeholder="Digite um nome de usuário" size="large" v-model="params.usuario"></el-input>
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
            <el-table v-loading="loading" v-if="params.categoria" :data="list" style="width: 100%">
                <el-table-column v-for="col in columns" :key="col.prop" :prop="col.prop" :label="col.label" />
            </el-table>
            <div v-if="params.categoria == ''" class="text-gray-400 flex justify-center">
                <h1>Realize uma pesquisa.</h1>
            </div>
        </el-card>

        <el-pagination :page-sizes="[10, 50, 100]" :page-size="params.limit" background :current-page.sync="params.page"
            layout="sizes, prev, pager, next" :total="total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" hide-on-single-page>
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
                apName: '',
                userMac: '',
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
    computed: {
        columns() {
            const categoria = this.params.categoria;
            const baseCols = [];

            switch (categoria) {
                case 'autenticacao':
                    baseCols[0] = {
                        prop: 'authApName',
                        label: 'AP Name'
                    };
                    baseCols[1] = {
                        prop: 'authUserName',
                        label: 'User Name'
                    };
                    baseCols[2] = {
                        prop: 'authUserMac',
                        label: 'User MAC'
                    };
                    baseCols[3] = {
                        prop: 'authSsid',
                        label: 'SSID'
                    };
                    baseCols[4] = {
                        prop: 'authResult',
                        label: 'Result'
                    };
                    break;

                case 'handshake':
                    baseCols[0] = {
                        prop: 'hsApName',
                        label: 'AP Name'
                    };
                    baseCols[1] = {
                        prop: 'hsUserName',
                        label: 'User Name'
                    };
                    baseCols[2] = {
                        prop: 'hsUserMac',
                        label: 'User MAC'
                    };
                    baseCols[3] = {
                        prop: 'hsSsid',
                        label: 'SSID'
                    };
                    baseCols[4] = {
                        prop: 'hsResult',
                        label: 'Result'
                    };
                    break;

                case 'associacao':
                    baseCols[0] = {
                        prop: 'assocApName',
                        label: 'AP Name'
                    };
                    baseCols[1] = {
                        prop: 'assocUserMac',
                        label: 'User MAC'
                    };
                    baseCols[2] = {
                        prop: 'assocSsid',
                        label: 'SSID'
                    };
                    baseCols[3] = {
                        prop: 'assocOfflineReason',
                        label: 'Offline Reason'
                    };
                    break;

                default:
                    return [];
            }


            return baseCols;
        }
    },
    methods: {
        formatDate(date) {
            if (date && date.length === 2) {
                const dataIniUtc = new Date(date[0]).toISOString();
                this.params.dataInicio = dataIniUtc;

                const dataFimUtc = new Date(date[1]).toISOString();
                this.params.dataFim = dataFimUtc;

            } else {
                this.params.dataInicio = undefined;
                this.params.dataFim = undefined;
            }
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
            this.params.limit = data
            switch (this.params.categoria) {
                case 'associacao':
                    this.fetchAssociations(this.params)
                    break;
                case 'autenticacao':
                    this.fetchAuthentications(this.params)
                    break;
                case 'handshake':
                    this.fetchHandshakes(this.params)
                    break;
                default:
                    break;
            }
        },
        handleCurrentChange(data) {
            this.params.page = data
            switch (this.params.categoria) {
                case 'associacao':
                    this.fetchAssociations(this.params)
                    break;
                case 'autenticacao':
                    this.fetchAuthentications(this.params)
                    break;
                case 'handshake':
                    this.fetchHandshakes(this.params)
                    break;
                default:
                    break;
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (!this.params.ssid) delete this.params.ssid;
                    if (!this.params.usuario) delete this.params.usuario;
                    if (!this.params.apName) delete this.params.apName;
                    if (!this.params.userMac) delete this.params.userMac;

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
        fetchAuthentications(params) {
            this.loading = true;
            axios.get('http://localhost:3000/authentication', { params })
                .then((response) => {
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
        fetchAssociations(params) {
            this.loading = true;
            axios.get('http://localhost:3000/association', { params })
                .then((response) => {
                    this.list = response.data.data;
                    this.total = response.data.total
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
};
</script>