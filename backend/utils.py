import json
import xml.etree.ElementTree as ET
from xml.dom.minidom import parseString
from llm import ChatGPT
import pydicom as dicom


def json_to_fhir_xml(json_data):
    # Parse the JSON data
    fhir_data = json.loads(json_data)
    
    # Create the root XML element, assuming 'Resource' is the root type
    root = ET.Element('Resource')
    
    def add_elements(parent, data):
        if isinstance(data, dict):
            for key, value in data.items():
                # Special handling for attributes (e.g., id, value) to conform with FHIR XML format
                if key in ['id', 'value']:
                    parent.set(key, str(value))
                else:
                    child = ET.SubElement(parent, key)
                    add_elements(child, value)
        elif isinstance(data, list):
            for item in data:
                # Assuming each item in the list is a complex object
                child = ET.Element('element')  # Use appropriate tag based on FHIR spec
                parent.append(child)
                add_elements(child, item)
        else:
            parent.text = str(data)
    
    # Build the XML structure from JSON
    add_elements(root, fhir_data)
    
    # Convert the XML structure to a string
    xml_str = ET.tostring(root, encoding='unicode')
    # Pretty print the XML
    dom = parseString(xml_str)
    pretty_xml_as_string = dom.toprettyxml()
    
    return pretty_xml_as_string
    # return xml_str

def hl7_to_xml(hl7_data: str):
    #assuming that the hl7 data is a string
    #parse the hl7 data to xml
    chat_model = ChatGPT()
    xml_data = chat_model.send_message(f"{hl7_data}\nPlease convert this hl7 data to xml. Place your response within <RESPONSE></RESPONSE> tags.")
    return xml_data.split("<RESPONSE>")[1].split("</RESPONSE>")[0]

def dictify(ds):
    output = dict()
    for elem in ds:
        if elem.VR != 'SQ': 
            output[elem.tag] = elem.value
        else:
            output[elem.tag] = [dictify(item) for item in elem]
    return output

# ds1 = dicom.dcmread("./series-00000/image-00207.dcm", stop_before_pixels=True)
# # print(dictify(ds1))
# # print(type(ds1.file_meta))
# # print(ds1.file_meta)
# # for elem in ds1:
# #     print(elem)
# print(str(ds1))
# Example hl7 data
# with open("sample.hl7", "r") as f:
#     hl7_data = f.read() 
# print(hl7_to_xml(hl7_data))

def dicom_metadata_to_xml(dicom_file_path: str):
    ds = str(dicom.dcmread(dicom_file_path, stop_before_pixels=True))
    chat_model = ChatGPT()
    xml_data = chat_model.send_message(f"{ds}\nPlease convert this dicom metadata to xml. Place your response within <RESPONSE></RESPONSE> tags.")
    return xml_data.split("<RESPONSE>")[1].split("</RESPONSE>")[0]

# print(dicom_metadata_to_xml("./series-00000/image-00207.dcm"))


# Example JSON FHIR data
# json_fhir_data = '{"resourceType": "Patient", "id": "example", "text": {"status": "generated", "div": "<div xmlns=\\"http://www.w3.org/1999/xhtml\\">John Doe</div>"}}'

# Convert and print the XML
# with open("sample_fhir_json_data.json", "r") as f:
#     json_fhir_data = f.read()
# print(json_fhir_data)

# xml_fhir_data = json_to_fhir_xml(json_fhir_data)
# print(xml_fhir_data)
