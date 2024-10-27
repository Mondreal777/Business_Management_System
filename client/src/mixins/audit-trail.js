import axios from 'axios';
export default {
    methods: {
        async saveAuditTrail(userId, module, action, data, oldData){
            const res = await axios.post(
            `${process.env.VUE_APP_API_BASE_URL}/audit-trail/save-audit-trail`,
            {
                userId: userId,
                module: module,
                action: action,
                data: data,
                oldData: oldData
            }
            );
        }
    }
}