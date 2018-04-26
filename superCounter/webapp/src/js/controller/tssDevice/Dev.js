var Dev = {
	// 身份证
	IDCardReader : null,
    // 银行卡片
    CardReader : null,
    // 密码键盘
	Pinpad : null,
    // 打印机
	Receipt :null,
    // 指纹仪
	Finger :  null,
    // 摄像头
	Camera: null,
// 	cardDispenser : null,
}

//文件操作参数
var FilePara = {
	//writeFile
	清空文件写入 : 0,
	追加写入 : 1,
};

//读卡器参数
var CardReaderPara = {
	//卡状态
	STATUS_NOCARD : "0",//无卡
	STATUS_GATE : "1",//卡在门口
	STATUS_CARDIN : "2",//卡在卡机内
	
	//允许进卡
	ACCEPT_DETECTMAGNETIC : "1",//检测磁边
	ACCEPT_NOTDETECT : "2",//不检测磁边
	
	//取消
	CANCEL_ALL : "0",//取消全部命令
	CANCEL_CURRENT : "1",//取消当前命令
	
	//复位
	RESET_NOTPROCESSING: "0",//卡片不处理
	RESET_REJECT : "1",//退卡
	RESET_RETAIN : "2",//吞卡
	
	
};

var EmvPara = {
	//卡片类型
	CARDTYPE_IDC : "1",
	CARDTYPE_RF : "0",
	//指令协议
	PROTOCOL_T0 : "0",
	PROTOCOL_T1 : "1",
	
	//读取标签内容 
	TAGS : "9F26,9F27,9F10,9F37,9F36,95,9A,9C,9F02,5F2A,82,9F1A,9F03,9F33,9F63,9F34,9F1E,9F41,9F09,9F35"
};

var PinPadPara = {
	//明文主密钥号
	plainMKName : "mk1",
	//密文
	ciphMKName : "mk2",
	pinKeyName : "wk1",
	macKeyName : "wk2"
};

var Constant = {
    websocket_url : "ws://192.168.1.117:12345",
//  websocket_url : "ws://127.0.0.1:12345",
    termConfigPath : null,
    SUCCESS : "0"
};

var CmdCode = {
    WFS_OPEN                 :1,//操作成功
    WFS_CLOSE                :2,
    WFS_CANCEL               :3,

    //打印机类
    DAM_CMD_PTR_RESET              :101,  //复位
    DAM_CMD_PTR_CONTROLMEDIA       :102,  //控制介质
    DAM_CMD_PTR_RAW_DATA           :103,  //打印行数据
    DAM_CMD_PTR_PRINT_IMG          :104,  //打印位图
    DAM_CMD_PTR_READPASSBOOK       :105,  //读存折
    DAM_CMD_PTR_PRINT_BARCODE      :106,  //打印条码
    DAM_CMD_PTR_WRITEPASSBOOK      :107,  //写存折磁道
    DAM_CMD_PTR_SET_BOLD           :108,  //设置黑体
    DAM_CMD_PTR_SET_FONT           :109,  //设置字体
    DAM_CMD_PTR_PRINT_FORM         :110,  //打印Form
    DAM_INF_PTR_STATUSCHANGE       :198,  //启动自动上送
    DAM_INF_PTR_STATUS             :199,  //获取设备状态

    //卡机类
    DAM_CMD_IDC_RESET              :201,  //复位
    DAM_CMD_IDC_READ_RAW_DATA      :202,  //允许进卡并读卡
    DAM_CMD_IDC_EJECT_CARD         :203,  //退卡
    DAM_CMD_IDC_RETAIN_CARD        :204,  //吞卡
    DAM_CMD_IDC_WRITE_RAW_DATA     :205,  //写卡
    DAM_CMD_IDC_RESET_COUNT        :206,  //复位吞卡数
    DAM_CMD_IDC_CHIP_POWER         :207,  //IC卡上/下电
    DAM_CMD_IDC_CHIP_IO            :208,  //IC卡APDU
    /*DAM_CMD_IDC_M1DETECT           :209,  //非接M1寻卡
    DAM_CMD_IDC_M1LOADKEY          :210,  //非接M1认证扇区密钥
    DAM_CMD_IDC_M1CHANGEKEY        :211,  //非接M1修改扇区密钥
    DAM_CMD_IDC_M1READ             :212,  //非接M1读数据
    DAM_CMD_IDC_M1WRITE            :213,  //非接M1对指定块写入数据*/
    DAM_INF_IDC_STATUSCHANGE       :298,  //启动自动上送
    DAM_INF_IDC_STATUS             :299,  //获取设备状态

    //密码键盘
    DAM_CMD_PIN_RESET              :401,  //复位
    DAM_CMD_PIN_GET_DATA           :402,  //获取明文
    DAM_CMD_PIN_GET_PIN            :403,  //获取密文
    DAM_CMD_PIN_IMPORT_KEY_EX      :404,  //装载密钥
    DAM_CMD_PIN_GET_PINBLOCK       :405,  //获取Pinblock
    DAM_CMD_PIN_CRYPT              :406,  //加解密运算
    DAM_CMD_PIN_MAC                :407,  //获取MAC
    DAM_INF_PIN_STATUSCHANGE       :498,  //启动自动上送
    DAM_INF_PIN_STATUS             :499,  //获取密码键盘状态

    //指纹仪
    DAM_CMD_FIN_RESET              :501,  //复位
    DAM_CMD_FIN_GETTEMPLATE        :502,  //获取模板
    DAM_CMD_FIN_GETFEATURE         :503,  //获取特征
    DAM_CMD_FIN_MATCH              :504,  //特征比较
    DAM_INF_FIN_STATUSCHANGE       :598,  //启动自动上送
    DAM_INF_FIN_STATUS             :599,  //获取指纹仪状态

    //发卡机类
    DAM_CMD_CRD_RESET              :1401,    //复位
    DAM_CMD_CRD_DISPENSECARD       :1402,    //发卡到读卡器
    DAM_CMD_CRD_EJECT_CARD         :1403,    //退卡
    DAM_CMD_CRD_RETAIN_CARD        :1404,    //吞卡
    DAM_CMD_CRD_READ_RAW_DATA      :1405,    //前端进卡+读卡
    DAM_CMD_CRD_CHIP_POWER         :1406,    //IC卡上/下电
    DAM_CMD_CRD_CHIP_IO            :1407,    //IC卡APDU交互
    DAM_INF_CRD_STATUSCHANGE       :1498,    //启动自动上送
    DAM_INF_CRD_STATUS             :1499,    //获取设备状态

    //摄像头类
    DAM_CMD_CAM_RESET              :1001,    //复位
    DAM_CMD_CAM_TAKE_PICTURE       :1002,    //拍照
    DAM_INF_CAM_STATUSCHANGE       :1098,    //启动自动上送
    DAM_INF_CAM_STATUS             :1099,    //获取设备状态

    //条码扫描类
    DAM_CMD_BCR_RESET              :1501,    //复位
    DAM_CMD_BCR_READ               :1502,    //读条码数据
    DAM_INF_BCR_STATUSCHANGE       :1598,    //启动自动上送
    DAM_INF_BCR_STATUS             :1599,    //获取设备状态

    //SIU类
    DAM_CMD_SIU_RESET              :801,    //复位
    DAM_CMD_SIU_SET_GUIDLIGHT      :802,    //控制灯
    DAM_CMD_SIU_SET_AUDIO          :803,    //控制蜂鸣器
    DAM_INF_SIU_STATUS             :899,    //获取设备状态

    //CAM类
    DAM_CMD_CAM_RESET              :1001,    //复位
    DAM_CMD_CAM_TAKE_PICTURE       :1002,    //拍照
    DAM_CMD_CAM_DIAPLAY            :1003,    //预览
    DAM_INF_CAM_STATUS             :1099,    //获取设备状态

    //现金类
    DAM_CMD_CDM_RESET              :301,    //复位
    DAM_CMD_CDM_OPEN_SHUTTER       :302,    //打开闸门
    DAM_CMD_CDM_CLOSE_SHUTTER      :303,    //关闭闸门
    DAM_CMD_CDM_DISPENSER          :304,    //发放钞票
    DAM_CMD_CDM_PRESENT            :305,    //接收钞票
    DAM_CMD_CDM_GETTOTALMONEY      :306,    //获取接收总金额
    DAM_CMD_CDM_RESETCOUNT         :307,    //复位金额
    DAM_INF_CDM_STATUS             :399,    //获取设备状态

    //人脸识别类
    DAM_CMD_FCD_START              :701,    //打开人脸识别系统
    DAM_CMD_FCD_END                :702,    //关闭人脸识别系统
    DAM_CMD_FCD_GETPHOTO           :703,    //拍照
    DAM_CMD_FCD_MATCH              :704,    //匹配
    DAM_INF_FCD_STATUS             :799,    //获取状态

    //文件回收类
    DAM_CMD_RCV_SCAN               :601,    //开启文件扫描
    DAM_CMD_RCV_GETFILE            :602,    //文件回收
    DAM_CMD_RCV_EJECT              :603,    //退回文件
    DAM_INF_RCV_STATUS             :699,    //获取状态

    //第三方
    WFS_CMD_DSF_EXEC                     :99
}

var Util = {
    str : {
        isNull : function (mode) {
            if (JSON.stringify(mode) == "{}" ||JSON.stringify(mode) == undefined) {
                return true;
            }
            return false;
        },

        isEmpty : function (mode) {
            if (JSON.stringify(mode) == "{}") {
                return true;
            }
            return false;
        }

    }
}


/**
 * 身份证实体
 * name: 姓名,
 * sex: 性别,
 * ethnicity: 名族,
 * birthday: 生日,
 * address: 籍贯,
 * idNumber: 省份证号码,
 * authority: 签发机关,
 * expiryDate: 有效期,
 * upPhoto: 正面照片,
 * bgPhoto: 反面照片
 */
var IDCardInfoEntity = {
    name : null,
    sex : null,
    ethnicity : null,
    birthday : null,
    address : null,
    idNumber : null,
    authority : null,
    expiryDate : null,
    upPhoto : null,
    bgPhoto : null
}

/**
 *  卡片实体
 * track1: 磁道一,
 * track2: 磁道二,
 * track3: 磁道三,
 * atr: ATR
 */
var ICCardInfoEntity = {
	cardNo : null,
    track1 : null,
    track2 : null,
    track3 : null,
    atr : null
};



