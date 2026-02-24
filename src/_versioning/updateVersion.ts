import Account from "../_types/Account";

export const CurrentVersion = 4;

export default function updateVersion(account:Account):Account{
    if(account.version === CurrentVersion)
        return account;
    if(account.version > CurrentVersion)
        throw new Error(`Unreckognized Account Version '${account.version}'`);

    let updatedAccount: Account = account;
    
    if(!account.version)
        updatedAccount = {...updatedAccount, version: 1};
    if(account.version === 1)
        updatedAccount = {...updatedAccount, version: 2, preferences:{studentLabeling:""}};
    if(account.version === 2){
        updatedAccount = {...updatedAccount, version: 3};
    }
    if (account.version === 3) {
        updatedAccount = { ...updatedAccount, version: 4 };
        for (const [courseId, course] of Object.entries(updatedAccount.courses)){
            for (const [studentId, student] of Object.entries(course.students)) {
                updatedAccount.courses[courseId].students[studentId] = {...student, placeIdByRoom: {}};
            }
            for (const [lessonId, lesson] of Object.entries(course.lessons)) {
                for (const [studentId, student] of Object.entries(lesson.students)) {
                    updatedAccount.courses[courseId].lessons[lessonId].students[studentId] = { ...student, placeIdByRoom: {} };
                }
            }
        }
        
    }

    return updatedAccount;
}