<template>
    <div class="m-10 p-5 rounded-md text-sm flex flex-col space-y-10">
        <el-card class="box-card" shadow="hover">
            <div class="flex items-center justify-between m-5 mb-10">
                <h1 class="z-0 font-semibold text-xl text-center w-full absolute left-1/2 transform -translate-x-1/2">
                    Autenticações
                </h1>
            </div>
            <el-table :data="props.dadosAuthentication" style="width: 100%"> <el-table-column prop="authApName"
                    label="AP" />
                <el-table-column prop="authUserName" label="User" />
                <el-table-column prop="datetime" :formatter="formatDate" label="Hora" />
                <el-table-column prop="authSsid" label="SSID" />
                <el-table-column prop="authResult" label="Result" />
            </el-table>
        </el-card>
        <el-card class="box-card" shadow="hover">
            <div class="flex items-center justify-between m-5 mb-10">
                <h1 class="z-0 font-semibold text-xl text-center w-full absolute left-1/2 transform -translate-x-1/2">
                    Associações
                </h1>
            </div>
            <el-table :data="props.dadosAssociation" style="width: 100%"> <el-table-column prop="assocApName"
                    label="AP" />
                <el-table-column prop="assocUserMac" label="User" />
                <el-table-column prop="datetime" :formatter="formatDate" label="Hora" />
                <el-table-column prop="assocOfflineReason" label="Offline Reason" />
                <el-table-column prop="assocUplinkRate" label="Uplink Rate" />
                <el-table-column prop="assocDownlinkRate" label="Downlink Rate" />
            </el-table>
        </el-card>
        <el-card class="box-card" shadow="hover">
            <div class="flex items-center justify-between m-5 mb-10">
                <h1 class="z-0 font-semibold text-xl text-center w-full absolute left-1/2 transform -translate-x-1/2">
                    Handshake
                </h1>
            </div>
            <el-table :data="props.dadosHandshake" style="width: 100%"> <el-table-column prop="hsApName" label="AP" />
                <el-table-column prop="hsUserName" label="User" />
                <el-table-column prop="datetime" :formatter="formatDate" label="Hora" />
                <el-table-column prop="hsSsid" label="SSID" />
                <el-table-column prop="hsResult" label="Result" />
                <el-table-column prop="hsBand" label="Band" />
            </el-table>

        </el-card>
    </div>
</template>

<script setup>
const props = defineProps({
    dadosAssociation: {
        type: Array,
        required: true
    },
    dadosAuthentication: {
        type: Array,
        required: true
    },
    dadosHandshake: {
        type: Array,
        required: true
    }
});
function formatDate(row, column, cellValue) {
    if (!cellValue) return '';
    const data = new Date(cellValue);
    const pad = n => n.toString().padStart(2, '0');

    const dia = pad(data.getDate());
    const mes = pad(data.getMonth() + 1);
    const ano = data.getFullYear();
    const horas = pad(data.getHours());
    const minutos = pad(data.getMinutes());
    const segundos = pad(data.getSeconds());

    return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
}

</script>