import java.io.File;
import java.io.IOException;
import java.util.Collection;
import java.util.LinkedList;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * mo project에 변경대상 파일 export
 * 
 * @author chpark15
 *
 */
public class Export_MODC {
	private static final Logger logger = LoggerFactory.getLogger(Export_MODC.class);
	public static final String MO_SRC = "/Users/jameslee/Documents/workspace/MO_DC_2017";
	public static final String MO_DEST = "/Users/jameslee/Documents/workspace/MO_DC_2017_1";
	
	private Collection<String> list = null;
	
	public void initialize() throws IOException {
		
	}
	
	public void execute() throws Exception {
		long startMills = System.currentTimeMillis();
		String sourceDir = null;
		File file = null;
		
		// resource_dev
//		list = new LinkedList<String>();
//		sourceDir = "resources_dev";
//		file = new File(sourceDir);
//		listf(file.getAbsolutePath(), file.getAbsolutePath(), list);
//		copyTo(sourceDir, MO+"webroot/lotte/resources_dev", list);

		// resources
		list = new LinkedList<String>();
		file = new File(MO_SRC);
		listf(file.getAbsolutePath(), file.getAbsolutePath(), list);
		copyTo(MO_SRC, MO_DEST, list);

/*
		// main jsp
		list = new LinkedList<String>();
		sourceDir = "webapp/WEB-INF/lotte_template";
		file = new File(sourceDir);
		listf(file.getAbsolutePath(), file.getAbsolutePath(), list);
		copyTo(sourceDir, MO+"webapp/WEB-INF/lotte_template", list);
		
		// 환경 파일
		list = new LinkedList<String>();
		sourceDir = "webapp/angular_common";
		file = new File(sourceDir);
		listf(file.getAbsolutePath(), file.getAbsolutePath(), list);
		copyTo(sourceDir, MO+"webapp/angular_common", list);
*/
		
		// common3
//		list = new LinkedList<String>();
//		sourceDir = "common3";
//		file = new File(sourceDir);
//		listf(file.getAbsolutePath(), file.getAbsolutePath(), list);
//		copyTo(sourceDir, MO+"webapp/common3", list);
		
		// lib는 변경되는 일이 거의 없으므로 기본 export에서 skip
//		list = new LinkedList<String>();
//		sourceDir = "lib";
//		file = new File(sourceDir);
//		listf(file.getAbsolutePath(), file.getAbsolutePath(), list);
//		copyTo(sourceDir, MO+"webroot/lib", list);
		
		long executedMills = System.currentTimeMillis() - startMills;
		System.out.println(executedMills+"millis");
	}
	
	public void listf(String prefix, String directoryName, Collection<String> files) throws IOException {
	    File directory = new File(directoryName);

	    // get all the files from a directory
	    File[] fList = directory.listFiles();
	    if (fList == null) {
	    	return;
	    }
	    for (File file : fList) {
	    	if (file.getName().equals(".svn")) {
	    		continue;
	    	}
	    	if (file.getName().equals("java_src") && file.isDirectory()) {
	    		continue;
	    	}
	    	if (file.getName().equals("resources") && file.isDirectory()) {
	    		continue;
	    	}
	        if (file.isFile()) {
	        	String path = file.getAbsolutePath();
	        	path = path.substring(prefix.length(), path.length());
	            files.add(path);
	        } else if (file.isDirectory()) {
	            listf(prefix, file.getAbsolutePath(), files);
	        }
	    }
	}
	
	public void copyTo(String sourceDir, String targetDir, Collection<String> files) throws IOException {
		int num=1;
		for (String file : files) {
			File sourceFile = new File(sourceDir, file);
			File targetFile = new File(targetDir, file);
			if (!targetFile.exists()) {
				targetFile.getParentFile().mkdirs();
				FileUtils.copyFile(sourceFile, targetFile, true);
				logger.info("["+num+++"]"+file);
				continue;
			}
			if (sourceFile.lastModified() == targetFile.lastModified()) {
				continue;
			}
			FileUtils.copyFile(sourceFile, targetFile, true);
			logger.info("["+num+++"]"+file);
			continue;
			
		}
	}
	
	public static void main(String[] args) throws Exception {
		Export_MODC instance = new Export_MODC();
		instance.initialize();
		instance.execute();
	}
}
