package sample;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.OutputStream;
import java.io.Serializable;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.UnavailableException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.IOUtils;
import org.apache.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

/**
 * AngularJS 기반의 SimpleBoard에 대한 서버 기능 제공
 * 
 * 1. 본 sample의 주 목적은 angularjs 기반의 클라이언트에 대한 지침을 제공하는 것이 주 목적이므로 server 기능은 최대한
 * 간결하게 제공하도록 한다. 2. data에 대한 저장은 객체 직렬화를 사용하며, concurrency 처리는 하지 않도록 한다.(복수의
 * 사용자 고려를 하지 않는다)
 * 
 * @author Chulhui Park <solsin@sys4u.co.kr>
 *
 */
public class SimpleBoardServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final Logger logger = LoggerFactory.getLogger(SimpleBoardServlet.class);

	final private static String JSON_CONTENT_TYPE = "application/json";
	final private static String OUTPUT_CHARSET = "UTF-8";

	private SimpleBoard simpleBoard = new SimpleBoard();
	private File file = null;
	private File uploadDir = null;

	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);

		String path = config.getServletContext().getRealPath("/WEB-INF/simpleBoard.data");
		File file = new File(path);
		if (!file.exists()) {
			try {
				file.createNewFile();
			} catch (IOException e) {
				logger.error("error occured during create file:{}", file.getAbsolutePath(), e);
				throw new ServletException(e);
			}
			logger.info("{} file created.", file.getAbsolutePath());
		}
		this.file = file;

		if (this.file.length() > 0) {
			simpleBoard.readData();
		}
		
		// init file upload dir
		String fileUpload = config.getServletContext().getRealPath("/WEB-INF/fileUpload");
		file = new File(fileUpload);
		if (!file.exists()) {
			file.mkdirs();
		}
		this.uploadDir = file;
	}

	private void writeJson(HttpServletResponse response, Map<String, Object> map)
			throws JsonGenerationException, JsonMappingException, IOException {
		response.setContentType(JSON_CONTENT_TYPE);
		response.setCharacterEncoding(OUTPUT_CHARSET);

		CommonError error = null;
		if (map.get("error") != null) {
			response.setStatus(HttpStatus.SC_INTERNAL_SERVER_ERROR);
			error = (CommonError) map.get("error");
		} else {
			response.setStatus(HttpStatus.SC_OK);
		}

		ObjectMapper mapper = new ObjectMapper();
		mapper.enable(SerializationFeature.INDENT_OUTPUT);
		mapper.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);
		mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
		mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
		mapper.enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT);
		mapper.enable(DeserializationFeature.ACCEPT_EMPTY_ARRAY_AS_NULL_OBJECT);
		
		if (error != null) {
			mapper.writeValue(response.getWriter(), error);
		} else {
			mapper.writeValue(response.getWriter(), map);
		}
	}

	/**
	 * simpleBoard 목록 : 페이징
	 */
	private void list(HttpServletRequest request, HttpServletResponse response)
			throws JsonGenerationException, JsonMappingException, IOException {
		Map<String, Object> map = new HashMap<String, Object>();
		String get_page = request.getParameter("page");
		int page = 1;
		try {
			page = Integer.parseInt(get_page);
		} catch (Exception e) {
			logger.warn("잘못된 page[{}]", get_page);
		}

		SimpleBoard get_simpleBoard = simpleBoard.list(page);
		map.put("simpleBoard", get_simpleBoard);

		writeJson(response, map);
	}
	
	/**
	 * get board entity
	 */
	private void view(HttpServletRequest request, HttpServletResponse response)
			throws JsonGenerationException, JsonMappingException, IOException, ServletException {
		Map<String, Object> map = new HashMap<String, Object>();

		String get_no = request.getParameter("no");
		int no = Integer.parseInt(get_no);
		SimpleBoardEntity entity = simpleBoard.get(no);

		map.put("simpleBoardEntity", entity);

		writeJson(response, map);
	}

	/**
	 * board entity 추가
	 */
	private void writeUpdate(HttpServletRequest request, HttpServletResponse response)
			throws JsonGenerationException, JsonMappingException, IOException, ServletException {
		Map<String, Object> map = new HashMap<String, Object>();
		
		String get_no = request.getParameter("no");
		int no = 0;
		if (get_no != null && get_no.length() > 0) {
			no = Integer.parseInt(get_no);
		}
		
		// 기 업로드된 SimpleFileEntity lookup
		Collection<SimpleFileEntity> files = new LinkedList<SimpleFileEntity>();
		String get_files_no = request.getParameter("files_no") == null ? "" : request.getParameter("files_no");
		String[] splits = get_files_no.split(",");
		for (String get_file_no : splits) {
			if (get_file_no.length() == 0) {
				continue;
			}
			int file_no = Integer.parseInt(get_file_no);
			SimpleFileEntity fileEntity = simpleBoard.getFile(file_no);
			files.add(fileEntity);
		}
		
		SimpleBoardEntity entity = null;
		if (no > 0) {
			entity = simpleBoard.get(no);
		} else {
			entity = new SimpleBoardEntity();
		}
		
		entity.name = request.getParameter("name");
		entity.subject = request.getParameter("subject");
		entity.content = request.getParameter("content");
		if (files.size() > 0) {
			if (entity.attachedFiles == null) {
				entity.attachedFiles = files;
			} else {
				entity.attachedFiles.addAll(files);
			}
		}		
		
		if (no == 0) {
			simpleBoard.add(entity);
		}		
		
		simpleBoard.writeData();

		map.put("simpleBoardEntity", entity);

		writeJson(response, map);
	}

	/**
	 * board entity 삭제
	 */
	private void remove(HttpServletRequest request, HttpServletResponse response)
			throws JsonGenerationException, JsonMappingException, IOException, ServletException {
		Map<String, Object> map = new HashMap<String, Object>();

		String[] get_nos = request.getParameterValues("checked_no");
		for (String get_no : get_nos) {
			int no = Integer.parseInt(get_no);
			SimpleBoardEntity entity = simpleBoard.remove(no);
			if (entity == null) {
				CommonError error = new CommonError();
				error.errorCode = "0001";
				error.errorMsg = "no[" + get_no + "]에 해당하는 데이터가 존재하지 않습니다.";
				map.put("error", error);
				break;
			} else {
				map.put("simpleBoardEntity", entity);
			}
		}

		writeJson(response, map);
	}
	
	/**
	 * file upload
	 */
	private void uploadFile(HttpServletRequest request, HttpServletResponse response)
			throws JsonGenerationException, JsonMappingException, IOException, ServletException, FileUploadException {
		boolean isMultipart = ServletFileUpload.isMultipartContent(request);
		if (!isMultipart) {
			throw new ServletException("파일 업로드 호출이 아닙니다.");
		}
		Map<String, Object> map = new HashMap<String, Object>();

		// Create a factory for disk-based file items
		DiskFileItemFactory factory = new DiskFileItemFactory();

		// Configure a repository (to ensure a secure temp location is used)
		ServletContext servletContext = this.getServletConfig().getServletContext();
		File repository = (File) servletContext.getAttribute("javax.servlet.context.tempdir");
		factory.setRepository(repository);

		// Create a new file upload handler
		ServletFileUpload upload = new ServletFileUpload(factory);

		// Parse the request
		List<FileItem> items = upload.parseRequest(request);
		List<SimpleFileEntity> uploadItems = new LinkedList<SimpleFileEntity>();
		for (FileItem item : items) {
			String filename = item.getName();
			String ext = filename.substring(filename.lastIndexOf('.'), filename.length());
			String uniqueName = System.currentTimeMillis() + ext;
			File file = new File(uploadDir, uniqueName);
			file.createNewFile();
			OutputStream out = null;
			try {
				out = new FileOutputStream(file);
				IOUtils.copy(item.getInputStream(), out);
			} finally {
				IOUtils.closeQuietly(out);
			}

			SimpleFileEntity entity = new SimpleFileEntity();
			entity.filename = filename;
			entity.filepath = file.getAbsolutePath();
			entity.size = file.length();
			entity.contentType = item.getContentType();
			entity.created = new Date();
			simpleBoard.add(entity);

			uploadItems.add(entity);
		}
		map.put("uploadFiles", uploadItems);

		writeJson(response, map);
	}
	
	/**
	 * file item 제거
	 */
	private void removeFile(HttpServletRequest request, HttpServletResponse response)
			throws JsonGenerationException, JsonMappingException, IOException, ServletException, FileUploadException {
		Map<String, Object> map = new HashMap<String, Object>();

		String get_no = request.getParameter("no");
		SimpleBoardEntity board_entity = null;
		if (get_no != null && get_no.length() > 0) {
			int no = Integer.parseInt(get_no);
			board_entity = simpleBoard.get(no);
		}
				
		String get_file_no = request.getParameter("file_no");
		int file_no = Integer.parseInt(get_file_no);
		SimpleFileEntity file_entity = simpleBoard.removeFile(file_no);
		if (file_entity == null) {
			CommonError error = new CommonError();
			error.errorCode = "0001";
			error.errorMsg = "no[" + get_file_no + "]에 해당하는 데이터가 존재하지 않습니다.";
			map.put("error", error);
		} else {
			if (board_entity != null) {
				board_entity.attachedFiles.remove(file_entity);
				simpleBoard.writeData();
			}			
			map.put("simpleFileEntity", file_entity);
			logger.info("removeFile:{}", file_entity);
		}
		
		writeJson(response, map);
	}
	
	/**
	 * file download
	 */
	private void downloadFile(HttpServletRequest request, HttpServletResponse response)
			throws JsonGenerationException, JsonMappingException, IOException, ServletException, FileUploadException {
		Map<String, Object> map = new HashMap<String, Object>();

		String get_file_no = request.getParameter("file_no");
		int no = Integer.parseInt(get_file_no);
		SimpleFileEntity entity = simpleBoard.getFile(no);
		if (entity == null) {
			throw new IllegalArgumentException("file_no["+no+"] doesn't exist");
		}
		InputStream in = null;
		try {
			// 세부 방어 코드는 생략한다.
			response.setContentType(entity.contentType);
			response.setContentLength((int)entity.size);
			response.setStatus(HttpStatus.SC_OK);
			
			File file = new File(entity.filepath);
			in = new FileInputStream(file);
			IOUtils.copy(in, response.getOutputStream());
		} finally {
			IOUtils.closeQuietly(in);
		}
	}

	/**
	 * 샘플 데이터 생성
	 */
	private void createSampleData(HttpServletRequest request, HttpServletResponse response)
			throws JsonGenerationException, JsonMappingException, IOException, ServletException {
		logger.info("start");

		for (int i = 1; i <= 1000; i++) {
			SimpleBoardEntity entity = simpleBoard.createEntity();
			entity.name = "[" + i + "]이름";
			entity.subject = "제목 [" + i + "]";
			entity.content = "본문 내용에 해당합니다. <b>굵게 강조</b>";
			simpleBoard.add(entity);
		}
		
		logger.info("end");
	}

	@Override
	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding(OUTPUT_CHARSET);

		Map<String, Object> map = new HashMap<String, Object>();
		try {
			String path = request.getRequestURL().toString();
			int idx = path.lastIndexOf('/');
			if (idx < 0) {
				throw new ServletException("invalid path:" + path);
			}
			path = path.substring(idx + 1, path.length());

			if ("list".equals(path)) {
				list(request, response);
			} else if ("view".equals(path)) {
				view(request, response);
			} else if ("writeUpdate".equals(path)) {
				writeUpdate(request, response);
			} else if ("remove".equals(path)) {
				remove(request, response);
			} else if ("fileUpload".equals(path)) {
				uploadFile(request, response);
			} else if ("removeFile".equals(path)) {
				removeFile(request, response);
			} else if ("downloadFile".equals(path)) {
				downloadFile(request, response);
			} else if ("createSampleData".equals(path)) {
				createSampleData(request, response);
			} else {
				throw new UnavailableException("지원하지 않는 path입니다.");
			}
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			CommonError error = new CommonError();
			error.errorCode = "9999";
			error.errorMsg = "서버 에러 발생";
			map.put("error", error);
			writeJson(response, map);
		}
	}

	/**
	 * SimpleBoard DAO와 json entity 두가지 기능 수행
	 */
	class SimpleBoard implements Serializable {
		private static final long serialVersionUID = 1L;

		@JsonProperty("max")
		int max = 0;
		@JsonProperty("totalSize")
		int totalSize = 0;
		@JsonProperty("items")
		@JsonSerialize(nullsUsing=NullToEmptyArraySerializer.class)
		List<SimpleBoardEntity> lists = new LinkedList<SimpleBoardEntity>();
		int fileMax = 0;
		List<SimpleFileEntity> fileLists = new LinkedList<SimpleFileEntity>();

		// data에 저장되지 않는 field들
		// transient keyword가 설정될 경우 JsonProperty를 Jackson json에서 인식하지 못해 getter를 정의함.
		transient int currentPage = 0; // 현재 페이지
		transient int totalPages = 0; // 총 페이지 갯수
		transient int startPage = 0; // 페이징 출력 페이지 넘버
		transient int endPage = 0; // 페이징 출력 페이지 넘버

		transient final int linenum_pages = 10; // 페이지당 출력 갯수
		transient final int pagenum = 10; // 페이징 출력 갯수

		// getter/setter for java bean spec(using serialization)
		public int getMax() {
			return max;
		}

		public void setMax(int max) {
			this.max = max;
		}

		public int getTotalSize() {
			return totalSize;
		}

		public void setTotalSize(int totalSize) {
			this.totalSize = totalSize;
		}

		public Collection<SimpleBoardEntity> getLists() {
			return lists;
		}

		public void setLists(List<SimpleBoardEntity> lists) {
			this.lists = lists;
		}

		public int getCurrentPage() {
			return currentPage;
		}

		public void setCurrentPage(int currentPage) {
			this.currentPage = currentPage;
		}

		public int getTotalPages() {
			return totalPages;
		}

		public void setTotalPages(int totalPages) {
			this.totalPages = totalPages;
		}

		public int getStartPage() {
			return startPage;
		}

		public void setStartPage(int startPage) {
			this.startPage = startPage;
		}

		public int getEndPage() {
			return endPage;
		}

		public void setEndPage(int endPage) {
			this.endPage = endPage;
		}

		public int getLinenum_pages() {
			return linenum_pages;
		}

		public int getPagenum() {
			return pagenum;
		}

		/**
		 * create entity instance
		 */
		public SimpleBoardEntity createEntity() {
			return new SimpleBoardEntity();
		}

		/**
		 * create entity instance
		 */
		public SimpleFileEntity createFileEntity() {
			return new SimpleFileEntity();
		}

		public SimpleBoard list(int page) {
			SimpleBoard simpleBoard = new SimpleBoard();
			List<SimpleBoardEntity> paged_list = new LinkedList<SimpleBoardEntity>();

			simpleBoard.totalSize = this.totalSize;
			simpleBoard.currentPage = page;
			simpleBoard.totalPages = totalSize / linenum_pages + (totalSize % linenum_pages == 0 ? 0 : 1);
			simpleBoard.startPage = page - (page % linenum_pages == 0 ? linenum_pages : page % linenum_pages) + 1;
			simpleBoard.endPage = (simpleBoard.startPage + linenum_pages) < simpleBoard.totalPages
					? (simpleBoard.startPage + linenum_pages - 1) : simpleBoard.totalPages;

			int startNum = (page * linenum_pages) - linenum_pages + 1;
			int endNum = startNum + linenum_pages - 1;
			int currentNum = 0;
			for (SimpleBoardEntity get_entity : lists) {
				currentNum++;
				if (currentNum < startNum) {
					continue;
				}
				if (currentNum > endNum) {
					break;
				}
				SimpleBoardEntity entity = createEntity();
				entity.no = get_entity.no;
				entity.name = get_entity.name;
				entity.subject = get_entity.subject;

				paged_list.add(entity);
			}
			simpleBoard.lists = paged_list;

			return simpleBoard;
		}
		
		/**
		 * get board entity
		 */
		public SimpleBoardEntity get(int no) {
			SimpleBoardEntity search_entity = createEntity();
			search_entity.no = no;

			int idx = lists.indexOf(search_entity);
			if (idx < 0) {
				return null;
			}
			return lists.get(idx);
		}

		/**
		 * add board entity to board
		 */
		public void add(SimpleBoardEntity entity) throws ServletException {
			entity.no = ++max;
			if (lists instanceof LinkedList) {
				((LinkedList<SimpleBoardEntity>) lists).addFirst(entity);
			} else {
				lists.add(entity);
			}
			totalSize++;
			
			writeData();
		}
		
		public SimpleFileEntity getFile(int file_no) {
			SimpleFileEntity search_entity = createFileEntity();
			search_entity.no = file_no;

			int idx = fileLists.indexOf(search_entity);
			if (idx < 0) {
				return null;
			}
			return fileLists.get(idx);
		}
		
		public void add(SimpleFileEntity entity) throws ServletException {
			entity.no = ++fileMax;
			fileLists.add(entity);
			
			writeData();
		}

		/**
		 * remove board entity from board
		 */
		public SimpleBoardEntity remove(int no) throws ServletException {
			SimpleBoardEntity entity = null;
			for (SimpleBoardEntity get_entity : simpleBoard.lists) {
				if (get_entity.no == no) {
					entity = get_entity;
					break;
				}
			}
			if (entity != null) {
				simpleBoard.lists.remove(entity);
				simpleBoard.totalSize--;
				
				writeData();
			}
			return entity;
		}
		
    /**
     * remove board entity from board
     */
    public SimpleFileEntity removeFile(int no) throws ServletException {
      SimpleFileEntity entity = null;
      for (SimpleFileEntity get_entity : simpleBoard.fileLists) {
        if (get_entity.no == no) {
          entity = get_entity;
          break;
        }
      }
      if (entity != null) {
        simpleBoard.fileLists.remove(entity);
        
        writeData();
      }
      return entity;
    }
		
		/**
		 * deserialization : data 파일로 부터 simpleBoard 객체 생성
		 */
		public void readData() throws ServletException {
			ObjectInputStream in = null;
			try {
				in = new ObjectInputStream(new FileInputStream(file));
				Object obj = in.readObject();
				if (obj == null) {
					logger.warn("data file[{}] is null", file.getAbsolutePath());
					return;
				} else if (!(obj instanceof SimpleBoard)) {
					logger.warn("object[{}] is not instance of SimpleBoard", obj);
					return;
				}

				SimpleBoard get_simpleBoard = (SimpleBoard) obj;
				simpleBoard.max = get_simpleBoard.max;
				simpleBoard.totalSize = get_simpleBoard.totalSize;
				simpleBoard.lists = get_simpleBoard.lists;
			} catch (Exception e) {
				logger.error("error occured during read file:{}", file.getAbsolutePath(), e);
				throw new ServletException(e.getMessage(), e);
			} finally {
				IOUtils.closeQuietly(in);
			}
		}

		/**
		 * serialization : simpleBoard 객체를 data 파일에 저장
		 */
		public void writeData() throws ServletException {
			ObjectOutputStream out = null;
			try {
				out = new ObjectOutputStream(new FileOutputStream(file));
				out.writeObject(simpleBoard);
				out.flush();
			} catch (Exception e) {
				logger.error("error occured during write file:{}", file.getAbsolutePath(), e);
				throw new ServletException(e.getMessage(), e);
			} finally {
				IOUtils.closeQuietly(out);
			}
		}
	}
	
	/**
	 * simpleBaord의 board entity
	 */
	class SimpleBoardEntity implements Serializable, Comparable<SimpleBoardEntity> {
		private static final long serialVersionUID = 1L;
		@JsonProperty("no")
		int no = 0;
		@JsonProperty("name")
		String name = "";
		@JsonProperty("subject")
		String subject = "";
		@JsonProperty("content")
		String content = "";
		@JsonProperty("created")
		Date created = new Date();
		@JsonProperty("updated")
		Date updated = new Date();
		@JsonProperty("attachedFiles")
		@JsonSerialize(nullsUsing=NullToEmptyArraySerializer.class)
		Collection<SimpleFileEntity> attachedFiles = null; // SimpleFileEntity.no에 대한 참조 array

		@Override
		public boolean equals(Object obj) {
			if (!(obj instanceof SimpleBoardEntity)) {
				return false;
			}
			return this.no == ((SimpleBoardEntity) obj).no;
		}

		@Override
		public String toString() {
			ObjectMapper mapper = new ObjectMapper();
			try {
				return mapper.writeValueAsString(this);
			} catch (JsonProcessingException e) {
				return super.toString();
			}
		}

		@Override
		public int compareTo(SimpleBoardEntity obj) {
			if (this.no > obj.no) {
				return 1;
			} else if (this.no == obj.no) {
				return 0;
			} else {
				return -1;
			}
		}
	}

	/**
	 * 업로드되는 파일 entity
	 */
	class SimpleFileEntity implements Serializable, Comparable<SimpleFileEntity> {
		private static final long serialVersionUID = 1L;
		@JsonProperty("no")
		int no = 0;
		@JsonProperty("filename")
		String filename = "";
		@JsonProperty("filepath")
		String filepath = "";
		@JsonProperty("contentType")
		String contentType = "";
		@JsonProperty("size")
		long size = 0;
		@JsonProperty("created")
		Date created = new Date();
		/** board entity에 attach 되었는지 여부: 일정 시간이 지났음에도 attach가 false인 data는 제거 대상*/
		boolean attached = false;

		@Override
		public boolean equals(Object obj) {
			if (!(obj instanceof SimpleFileEntity)) {
				return false;
			}
			return this.no == ((SimpleFileEntity) obj).no;
		}

		@Override
		public String toString() {
			ObjectMapper mapper = new ObjectMapper();
			try {
				return mapper.writeValueAsString(this);
			} catch (JsonProcessingException e) {
				return super.toString();
			}
		}

		@Override
		public int compareTo(SimpleFileEntity obj) {
			if (this.no > obj.no) {
				return 1;
			} else if (this.no == obj.no) {
				return 0;
			} else {
				return -1;
			}
		}
	}

	/**
	 * common json error 출력 entity
	 */
	class CommonError {
		@JsonProperty("errorCode")
		String errorCode = "";
		@JsonProperty("errorMsg")
		String errorMsg = "";
	}

	public static void main(String[] args) {
		SimpleBoardServlet instance = new SimpleBoardServlet();
		LinkedList<SimpleFileEntity> list = new LinkedList<SimpleFileEntity>();
		for (int i = 1; i < 100; i++) {
			SimpleFileEntity file = instance.simpleBoard.createFileEntity();
			file.no = i;
			file.filename = "[" + i + "]filename";
			file.filepath = "/WEB-INF/files/" + i;
			list.add(file);
		}
		SimpleFileEntity file = instance.simpleBoard.createFileEntity();
		file.no = 21;

		int idx = list.indexOf(file);
		logger.info("contains of:{}", list.contains(file));
		logger.info("indexof:{}", idx);
		logger.info("file entity:{}", list.get(idx));
	}
}