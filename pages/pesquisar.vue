<template>
    <div class="space-y-10 m-10">
        <el-card class="box-card" shadow="hover">
            <el-row :gutter="10">
                <el-col class="mt-2" :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                    <el-select size="large" v-model="params.categoria" placeholder="Categoria">
                        <el-option v-for="item in categorias" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col class="mt-2" :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                    <el-date-picker size="large" style="width:100%" v-model="date" type="datetimerange"
                        range-separator="a" start-placeholder="Data inicial" end-placeholder="Data final"
                        value-format="YYYY-MM-DDTHH:mm:ss" @change="formatDate"></el-date-picker>
                </el-col>
                <el-col class="mt-2" :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                    <el-input size="large" placeholder="SSID" v-model="params.ssid"></el-input>
                </el-col>
                <el-col v-if="categoria != 'associacao'" class="mt-2" :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                    <el-input size="large" placeholder="Usuário" v-model="params.usuario"></el-input>
                </el-col>
                <el-col class="mt-2">
                    <el-button size="large">Limpar params</el-button>
                    <el-button @click="submit" size="large" type="primary">Pesquisar</el-button>
                </el-col>
            </el-row>
        </el-card>

        <el-card class="box-card" shadow="hover">
            <el-table :data="list" style="width: 100%">
                <el-table-column prop="authApName" label="AP" />
                <el-table-column prop="authUserName" label="User" />
                <el-table-column prop="datetime" label="Hora" />
                <el-table-column prop="authSsid" label="SSID" />
                <el-table-column prop="authResult" label="Result" />
            </el-table>
        </el-card>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            date: [],
            params: {
                user: '',
                categoria: '',
                ssid: '',
                dataInicio: '',
                dataFim: '',
            },
            categorias: [
                { value: 'autenticacao', label: 'Autenticação' },
                { value: 'associacao', label: 'Associação' },
                { value: 'handshake', label: 'Handshake' },
            ],
            list: [],
            activeIndex: '1',
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
        submit() {
            if (!this.params.ssid) delete this.params.ssid;
            if (!this.params.user) delete this.params.user;

            console.log(this.params);
            

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
        },
        fetchHandshakes(params) {
            delete params.categoria
            axios.get('http://localhost:3000/handshake', { params })
                .then((response) => {
                    this.list = response.data
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    // always executed
                });
        },
        fetchAssociations() { },
        fetchAuthentications() { }
    }
};
</script>