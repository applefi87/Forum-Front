架設中，初步將供師大1.5萬多位學生使用

開發重點:(部分建置中)  
一、新功能:  
1.修改論壇架構，版主可自由擴充主題與功能，不再限於特定主題。
2.可客製必填欄位與格式(欄位名、必填?、文字/數字/布林/多選...、選項名稱)  ，前端輸入區會自動調整介面，後端自動以此審核資料並儲存，不需工程師介入調整。
3.可客製顯示介面，因應不同主題呈現適合介面，提供良好使用者體驗。
4.可上傳多個子板資料(csv檔)，依照版規自動審核加工後儲存  
5.特殊的多語言設計，不同語言文章會集中在同主題而非分成不同主題
-可選擇查看特定語系文章  
-評價/發文也因此要選擇對應語系(預設使用者語系)  
  
二、資料安全  
-板規有列出的欄位才會存入資料庫，以免用Postman攻擊  
-防XSS、DDOS、資料庫穿透攻擊，限制請求次數。  
-防止Email帳號的"."、"-"等符號被Gmail省略，造成可重複註冊。  
-驗證次數限制  
  
三、優化效能  
1.發文者會顯示他的徽章、留言數等紀錄，讀取量大更改少的資料參考MongoDB反正規化(如下)。  
-發文後，後端自動計算新結果更新於使用者下，調取資訊不用爬整個伺服器重算。  
2.規劃MongoDB的index加快讀取性能、Mongoose改用.insertMany(快4倍)、.bilkSave(快10倍)語法  
3.同課程名+老師，不同學期應視為同個評價目標，伺服器讀取版規後，對部分資料壓縮加快效能與合理性。(壓縮欄位被視為內部細項，並非新的板塊，但給評價需指明細項。)  
4.如何載入/更新頁面效率最高  



