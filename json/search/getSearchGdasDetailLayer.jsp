<%@ page contentType="application/json; charset=UTF-8" %>
<%
String gdasNo = request.getParameter("gdasNo");
%>
<% if(gdasNo.equals("67729672")){ %>
<%--
* 상품평 상세 레이어
-바인딩변수(상품평번호) : gdas_no=67729671
-호출url : /json/search/getSearchGdasDetailLayer.json?gdas_no=67729671
--%>
{
  "gdasDtlInfo" : {
    "gdasNo" : 67729670,
    "goodsNo" : 358449364,
    "gdasStfdVal" : 5,
    "gdasCont" : "좋다는 입소문때문에 집에 수많은 립상품들을 배신하고, 구입했습니다.\r\n\r\n생각보다 발색이 안된다는 글을 읽고 고민하다가, \r\n그래도 립밤의 형태로 쓸 생각으로 구입했습니다.\r\n\r\n그러나~!! 사실 블로그의 등록된 컬러감은 조금 차이가 나지만,\r\n그렇다고 아주 차이가 많이 나지는 않습니다.\r\n\r\n립밤과 틴트의 중간 개념으로 생각하시면, 아주 만족스러우실꺼에요~^^\r\n\r\n쨍쨍한 컬러를 가지고 있는 립스틱은 아니잖아요~~\r\n그렇다고 컬러가 밍밍하거나 하지 않는다는점도 기억해주세요~\r\n\r\n저는 개인적으로 \r\n더욱이 더 만족스러웠던건~!!\r\n립틴트는 너무 건조하고, 립밤은 너무 컬러가 나오지않고..\r\n그 위에 립글로스를 얹게되면 촉촉해보이긴 하지만, \r\n붙는듯한 그 느낌....이 있는데..\r\n\r\n건조하지도 않고...윤기와 촉촉함이 느껴지면서..\r\n그리고 산뜻함까지 느껴지며, 아주 고르게 자아아알~~ 발리는 제품입니다.\r\n\r\n셀카모드로 그냥 막 찍은 사진이라 컬러감이 많이 부족하네요 ㅠㅠ",
    "imgUrl" : "http://image.lotte.com/upload/crit/vital522_577749.jpg"
  }
}
<% }else if(gdasNo.equals("67729673")){ %>
<%--
--------------------------------------------------------
-바인딩변수(상품평번호) : gdas_no=67729670
-호출url : /json/search/getSearchGdasDetailLayer.json?gdas_no=67729670
--%>
{
  "gdasDtlInfo" : {
    "gdasNo" : 67729671,
    "goodsNo" : 358449364,
    "gdasStfdVal" : 4.5,
    "gdasCont" : "브랜드데이,기획세트 구성대로 왔아요.차일피일 미루다 샀는데 피부가 먼저 아네요.",
    "imgUrl" : ""
  }
}
<% }else if(gdasNo.equals("67729674")){ %>
{
  "gdasDtlInfo" : {
    "gdasNo" : 0,
    "goodsNo" : 358449364,
    "gdasStfdVal" : 0,
    "gdasCont" : null,
    "imgUrl" : null
  }
}
<% }else{ %>
<%--
--------------------------------------------------------
-불량, 삭제, 탈퇴회원의 상품평인 경우. 리턴 결과.
--%>
{
  "gdasDtlInfo" : {
    "gdasNo" : 0,
    "goodsNo" : 0,
    "gdasStfdVal" : 0,
    "gdasCont" : null,
    "imgUrl" : null
  }
}
<% } %>
<%-- gdasNo : 0 인 경우. ==> 유효하지 않은 상품평 문구 레이어 노출 --%>