package com.lotte.mobile2;

import java.io.File;
import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.lotte.mobile.common.MLotteProperties;

/**
 * local에서 angularjs 개발 페이지에 대해 vdi의 mo와 유사한 개발환경(url path)을 제공하기 위한 simple servlet
 * @author solsin
 *
 */
public class SimpleServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final Logger logger = LoggerFactory.getLogger(SimpleServlet.class);
	
	/**
	 * cookie name: XSRF(Cross Site Request Forgery) cookie
	 */
	public static final String XSRF_TOKEN = "XSRF-TOKEN";
	
	private String templateHome = null;
	private String resourcePath = null;
	private ServletContext mo_webroot_ctx = null;

	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		String templateHome = config.getInitParameter("templateHome");
		String resourcePath = config.getInitParameter("resourcePath");
		String realPath = config.getServletContext().getRealPath(templateHome);
		File file = new File(realPath);
		if (!file.exists()) {
			throw new ServletException("doesn't exist template Home["+file.getAbsolutePath()+"]");
		}
		this.templateHome = templateHome;
		this.resourcePath = resourcePath;
		
		try {
			String mo_properties = System.getProperty("mo.properties");
			if (mo_properties == null || mo_properties.length() == 0) {
				mo_properties = "mo.properties";
			}
			
			realPath = config.getServletContext().getRealPath("/WEB-INF/"+mo_properties);
			file = new File(realPath);
			MLotteProperties.initialize(file);
		} catch (IOException e) {
			throw new ServletException("prop load중 에러발생:"+e.getMessage(), e);
		}
		
		this.mo_webroot_ctx = config.getServletContext().getContext("/MO_WEBROOT");
		if (this.mo_webroot_ctx == null) {
			throw new ServletException("/MO_WEBROOT context가 정의되지 않았습니다.");
		}
	}

	/**
	 * XSRF_TOKEN cookie 생성
	 */
	private void createXSRFCookie(HttpServletRequest request, HttpServletResponse response) {
		String value = request.getSession().getId();
		Cookie cookie = new Cookie(XSRF_TOKEN, value);
		cookie.setMaxAge(-1);
		response.addCookie(cookie);
	}
	
	/**
	 * XSRF_TOKEN cookie를 조회해서 없으면 생성시키고 있으면 cookie value를 리턴한다.
	 * 
	 * @return 없는 경우 "" return
	 */
	private String getXSRFCookie(HttpServletRequest request, HttpServletResponse response) {
		Cookie[] cookies = request.getCookies();
		if (cookies == null || cookies.length == 0) {
			createXSRFCookie(request, response);
			return "";
		}
		
		for (Cookie cookie : cookies) {
			String name = cookie.getName();
			if (XSRF_TOKEN.equals(name)) {
				return cookie.getName();
			}
		}
		
		createXSRFCookie(request, response);
		return "";
	}


	@Override
	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String path = request.getServletPath();
		String url = request.getRequestURI();
		if (path.endsWith(".do")) {
			getXSRFCookie(request, response);
			
			path = path.substring(0, (path.length()-".do".length()));
			String templatePath = templateHome+path+".jsp";
			
			RequestDispatcher dispatcher = request.getRequestDispatcher(templatePath);
			dispatcher.forward(request, response);
			return;
		}
		
//		if (path.startsWith(resourcePath)) {
//			url = url.substring(path.length(), url.length());
//		}
		
		if (path.endsWith(".json")) {
			String type = request.getParameter("type");
			if (type == null || type.length() == 0) {
				type = "default";
			}
			int idx = path.length() - ".json".length();
			url = path.substring(0, idx) + "."+ type + ".json";
			
			String delay = request.getParameter("delay");
			if (delay != null && delay.length() > 0) {
				long time_delay = Long.parseLong(delay);
				try {
					Thread.sleep(time_delay);
				} catch (InterruptedException e) {
					logger.warn("delay["+delay+"] 중 interrupt 발생");
				}
			}
			
			if ("error".equals(type)) {
				response.setStatus(HttpStatus.SC_INTERNAL_SERVER_ERROR);
			}
		}
		
		RequestDispatcher dispatcher = mo_webroot_ctx.getRequestDispatcher(url.toString());
		dispatcher.forward(request, response);
	}
	
	

}
