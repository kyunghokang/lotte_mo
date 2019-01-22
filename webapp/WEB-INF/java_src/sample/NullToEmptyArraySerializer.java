package sample;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

public class NullToEmptyArraySerializer extends JsonSerializer<Object> {
	public NullToEmptyArraySerializer() {
		
	}
	@Override
	public void serialize(Object value, JsonGenerator generator, SerializerProvider provider)
			throws IOException, JsonProcessingException {
		generator.writeStartArray();
		generator.writeEndArray();
	}
}