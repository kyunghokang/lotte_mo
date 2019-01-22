package com.lotte.mobile.common;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.Properties;

/**
 * mo project의 MLotteProperties에 호환 클래스
 * 
 * @author solsin
 *
 */
public class MLotteProperties {
	private static MLotteProperties INSTANCE = new MLotteProperties();
	
	private final Properties props = new Properties();
	
	public static void initialize(File file) throws IOException {
		FileReader reader = new FileReader(file);
		INSTANCE.props.load(reader);
	}

	public static String get(String key) {
		return INSTANCE.props.getProperty(key);
	}
}
