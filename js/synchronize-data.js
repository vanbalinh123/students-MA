
/* ------ Start Global Variables Declaration ------*/
var indexInLocalStorage = MINUS_ONE_NUMBER;
/* ------ End Global Variables Declaration ------*/

/* ------ Start Functions Declaration ------*/
function checkDataIntegrityBeforeChange(actionType, studentObject) {
    currentActiveElement = document.activeElement;
    actionType = actionType.toLowerCase().trim();

    if (actionType === ACTION_ADD_STUDENT) {
        return !isDataChangedBeforeAdd(actionType);
    } else if (actionType === ACTION_UPDATE_STUDENT || actionType === ACTION_DELETE_STUDENT) {
        return !isDataChangedBeforeUpdateOrDelete(actionType, studentObject);
    }

    return false;
}

function isDataChangedBeforeAdd(actionType) {
    return (
        isLengthOfStudentInfoListChanged(actionType) || 
        isDataOfStudentInfoListChanged(actionType)
    );
}

function isDataChangedBeforeUpdateOrDelete(actionType, studentObject) {
    return (
        isCurrentStudentIdNotExisted(studentObject) || 
        isLengthOfStudentInfoListChanged(actionType) || 
        isDataOfCurrentStudentChanged(actionType, studentObject) || 
        isDataOfStudentInfoListChanged(actionType)
    );
}

function isLengthOfStudentInfoListChanged(actionType) {
    if (students.length !== getLengthOfListInLocalStorage()) {
        showAlertWhenLengthOfListChanged(actionType);
        return true;
    } else {
        return false;
    }
}

function isDataOfStudentInfoListChanged(actionType) {
    let studentInfoList = localStorage.getItem('students');

    if (studentInfoList && studentInfoList != '[]') {
        let studentsInLocalStorage = JSON.parse(studentInfoList.trim());

        for (let i = 0; i < students.length; i++) {
            if (!isEqualObject(studentsInLocalStorage[i], students[i])) {
                showAlertWhenDataOfListChanged(actionType);
                return true;
            } else {
                continue;
            }
        }
    }

    return false;
}

function isCurrentStudentIdNotExisted(studentObject) {
    let studentInfoList = localStorage.getItem('students');

    if (studentInfoList && studentInfoList != '[]') {
        let studentId = parseInt(studentObject.id);
        let studentsInLocalStorage = JSON.parse(studentInfoList.trim());
        indexInLocalStorage = findIndexOfItemByIdInArray(studentsInLocalStorage, studentId);

        if (indexInLocalStorage === MINUS_ONE_NUMBER) {
            showAlertWhenStudentIdNotExisted(studentObject.fullName);
            return true;
        } else {
            return false;
        }
    } else {
        showAlertWhenStudentIdNotExisted(studentObject.fullName);
        return true;
    }
}

function isDataOfCurrentStudentChanged(actionType, studentObject) {
    let studentInfoList = localStorage.getItem('students');

    if (studentInfoList && studentInfoList != '[]') {
        let studentsInLocalStorage = JSON.parse(studentInfoList.trim());

        if (!isEqualObject(studentsInLocalStorage[indexInLocalStorage], studentObject)) {
            showAlertWhenStudentDataChanged(actionType, studentObject);
            return true;
        } else {
            return false;
        }
    } else {
        showAlertWhenStudentDataChanged(actionType, studentObject);
        return true;
    }
}

function showAlertWhenLengthOfListChanged(actionType) {
    showAlertWhenStudentInfoListChanged(actionType);
}

function showAlertWhenDataOfListChanged(actionType) {
    showAlertWhenStudentInfoListChanged(actionType);
}

function showAlertWhenStudentInfoListChanged(actionType) {
    let textValueOfAction = getTextValueOfAction(actionType);

    alertBeforeChange(
        `H???p tho???i C???nh b??o`, 
        `Danh s??ch sinh vi??n hi???n ch??a ???????c ?????ng b???. Ch????ng tr??nh ph??t hi???n ???? c?? s??? thay ?????i tr?????c ????.<br>
        B???n vui l??ng nh???n n??t ?????ng b??? tr?????c khi ${textValueOfAction}.`, 
        `?????ng b??? tr?????c khi ${textValueOfAction}`, 
        currentActiveElement, 
        function(isAlertOk) {
            if (isAlertOk) {
                processDisplayBeforeSynchronize();
                synchronizeData(true);
            }
        }
    );
}

function showAlertWhenStudentIdNotExisted(studentFullName) {
    alertBeforeChange(
        `H???p tho???i C???nh b??o`, 
        `Th??ng tin v??? sinh vi??n ${studentFullName} hi???n kh??ng c??n t???n t???i do d??? li???u ???? b??? x??a tr?????c ????.<br>
        B???n vui l??ng nh???n n??t ?????ng b??? ????? ki???m tra.`, 
        `?????ng b??? Danh s??ch sinh vi??n`, 
        currentActiveElement, 
        function(isAlertOk) {
            if (isAlertOk) {
                processDisplayBeforeSynchronize();
                synchronizeData(false, true);
            }
        }
    );
}

function showAlertWhenStudentDataChanged(actionType, studentObject) {
    let textValueOfAction = getTextValueOfAction(actionType);

    alertBeforeChange(
        `H???p tho???i C???nh b??o`, 
        `D??? li???u v??? sinh vi??n ${studentObject.fullName} hi???n ch??a ???????c ?????ng b??? do th??ng tin ???? b??? thay ?????i tr?????c ????.<br>
        B???n vui l??ng nh???n n??t ?????ng b??? tr?????c khi ${textValueOfAction}.`, 
        `?????ng b??? tr?????c khi ${textValueOfAction}`, 
        currentActiveElement, 
        function(isAlertOk) {
            if (isAlertOk) {
                processDisplayBeforeSynchronize();
                synchronizeData(false, false, studentObject);
            }
        }
    );
}

function processDisplayBeforeSynchronize() {
    setTimeout(function() {
        showProcessWindow(
            `B???n vui l??ng ch??? trong gi??y l??t.<br>
            Ch????ng tr??nh ??ang ?????ng b??? d??? li???u...`
        );
    }, 300);

    setTimeout(function() { hideProcessWindow(); }, 3000);
}

function synchronizeData(isLengthOfListChanged, isStudentIdNotExisted = false, studentObject = null) {
    if (isLengthOfListChanged || isStudentIdNotExisted) {
        setTimeout(function() {
            displayStudentInfoList();

            if (findIndexOfItemByIdInArray(students, currentStudentId) === MINUS_ONE_NUMBER) {
                btnSaveStudentInfo.value     = ACTION_ADD_STUDENT;
                btnSaveStudentInfo.innerText = 'Th??m m???i';
            }
        }, 3200);

        setTimeout(function() {
            sendAlertNotification(
                `Ch????ng tr??nh ???? <font color='#ffff00'>?????ng b??? xong</font> d??? li???u Danh s??ch sinh vi??n !`, 
                3500, '#104463'
            );
        }, 4000);
    } else {
        setTimeout(function() { displayStudentInfoListAfterSynchronize(parseInt(studentObject.id)); }, 3200);
        setTimeout(function() { scrollBackToFocusedTableRow(); }, 3600);

        setTimeout(function() {
            sendAlertNotification(
                `Ch????ng tr??nh ???? <font color='#ffff00'>?????ng b??? xong</font> d??? li???u v??? sinh vi??n <font color='#ffff00'>${studentObject.fullName}</font> !`, 
                3500, '#104463'
            );
        }, 4200);
    }
}

function displayStudentInfoListAfterSynchronize(synchronizedStudentId) {
    let studentInfoList = localStorage.getItem('students');

    if (studentInfoList && studentInfoList != '[]') {
        students                = JSON.parse(studentInfoList.trim());
        foundStudents           = getArrayOfSearchedStudents();
        let synchronizedStudent = getStudentById(foundStudents, synchronizedStudentId);

        if (synchronizedStudent) {
            tblStudentInfoList.innerHTML = renderStudentDataTable(foundStudents);
            currentTableRowIndex = findIndexOfItemByIdInArray(foundStudents, synchronizedStudentId);
        } else {
            resetFilterSearchForm();
            txtKeywordSearch.blur();

            tblStudentInfoList.innerHTML = renderStudentDataTable(students);
            currentTableRowIndex = findIndexOfItemByIdInArray(students, synchronizedStudentId);
        }

        if (currentTableRowIndex >= 0) {
            setBgColorOfCurrentTableRow(currentTableRowIndex, ACTION_UPDATE_STUDENT);
            currentLocationFromTop = getLocationFromTopOfTableRow(currentTableRowIndex);
        }
    } else {
        tblStudentInfoList.innerHTML = renderStudentDataTable([]);
    }
}

function getLengthOfListInLocalStorage() {
    let studentInfoList = localStorage.getItem('students');

    if (studentInfoList && studentInfoList != '[]') {
        return JSON.parse(studentInfoList.trim()).length;
    } else {
        return 0;
    }
}

function getTextValueOfAction(actionType) {
    if (actionType === ACTION_ADD_STUDENT) {
        return 'Th??m m???i';
    } else if (actionType === ACTION_UPDATE_STUDENT) {
        return 'C???p nh???t';
    } else if (actionType === ACTION_DELETE_STUDENT) {
        return 'X??a';
    }

    return `Thao t??c ng?????i d??ng ch??a x??c ?????nh.<br>Ch???c n??ng ???? c?? l???i x???y ra !!!`;
}

function isEqualObject(jsonObject_1, jsonObject_2) {
    if (Object.keys(jsonObject_1).length === Object.keys(jsonObject_2).length) {
        for (key in jsonObject_1) {
            if (jsonObject_1[key] === jsonObject_2[key]) {
                continue;
            } else {
                return false;
            }
        }

        return true;
    } else {
        return false;
    }
}
/* ------ End Functions Declaration ------*/