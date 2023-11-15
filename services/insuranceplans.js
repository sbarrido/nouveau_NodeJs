const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getAllPlansByProvider(providerid) {
    const planids = await prisma.providerplan.findMany({
        where: { insuranceproviderid: providerid},
        select: {
            planid: true
        }
    });

    let plans = [];
    for(let i=0; i<planids.length; i++) {
        const plan = await prisma.plan.findFirst({
            where: { planid: planids[i].planid }
        });
        plans.push(plan);
    }

    return plans;
}


async function getPlanByPatient(patientid) {
    const plan = await prisma.patientinsurance.findFirst({
        where: { patientid: patientid }
    })

    return plan;
}


async function getPlanById(planid) {
    const plan = await prisma.patientinsurance.findFirst({
        where: { planid: planid }
    })

    return plan;
}

async function getAllPatientIdsByProvider(providerid) {
    const ids = await prisma.patientinsurance.findMany({
        where: { insuranceproviderid: providerid},
        select: {
            patientid: true,
        }
    });

    return ids
}

// includes patient id and name and plan id and name
async function getAllPatientsAndPlansBasicByProvider(providerid) {
    const ids = await prisma.patientinsurance.findMany({
        where: { insuranceproviderid: providerid},
        select: {
            patientid: true,
            planid:true
        }
    });

    let patients = []
    for(let i=0; i<ids.length; i++) {
        const patient = await prisma.user.findFirst({
            where: { userid: ids[i].patientid },
            select: {
                userid: true,
                name: true
            }
        });
        patients.push(patient);
    }

    let plans = []
    for(let i=0; i<ids.length; i++) {
        const plan = await prisma.plan.findFirst({
            where: { planid: ids[i].planid },
            select: {
                planid: true,
                name: true
            }
        });
        plans.push(plan);
    }

    let combos = []
    for(let i=0; i<ids.length; i++) {
        const combo = {
            patientid: patients[i].userid,
            patientname: patients[i].name,
            planid: plans[i].planid,
            planname: plans[i].name 
        }
        combos.push(combo);
    }

    return combos;
}





module.exports = {
    getAllPatientIdsByProvider,
    getAllPatientsAndPlansBasicByProvider,
    getAllPlansByProvider,
    getPlanById,
    getPlanByPatient
};