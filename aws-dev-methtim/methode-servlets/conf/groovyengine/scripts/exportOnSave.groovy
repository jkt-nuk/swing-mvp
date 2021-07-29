/*******************************************************************************

* CHANGELOG:

*/
package newsuk

import javax.servlet.ServletConfig
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import javax.xml.xpath.*;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory
import javax.xml.transform.*;
import javax.xml.transform.stream.*;
import javax.xml.transform.dom.*;


import java.text.*
import org.xml.sax.InputSource
import org.w3c.dom.*
import org.json.*
import org.slf4j.Logger;

import com.eidosmedia.wa.util.EomDb
import com.eidosmedia.wa.util.EomDbObject
import com.eidosmedia.wa.render.EomDbHelper
import com.eidosmedia.wa.render.WebObject
import com.eidosmedia.wa.render.WebObjectImpl
import com.eidosmedia.wa.render.WebLink
import com.eidosmedia.wa.render.WebZone
import com.eidosmedia.eom.story.*;
import EOM.FileSystemObject
import EOM.Folder
import EOM.FolderHelper
import EOM.File
import EOM.FileHelper

import EOM.DuplicatedName
import EOM.ObjectNotFound
import javax.net.ssl.*
import java.security.cert.*
import java.io.BufferedReader
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.IOException
import java.io.InputStream
import java.io.InputStreamReader

import java.io.OutputStream
import java.nio.charset.Charset
import java.nio.charset.StandardCharsets
import java.util.regex.Matcher
import java.util.regex.Pattern
import java.util.HashSet
import java.util.Set
import java.util.ArrayList

class NUKLogger {

   static public Logger out;

}

NUKLogger.out = logger

void main() {
   NUKLogger.out.debug('Training  script...')

   EomDbHelper dbHelper = params['mainSession'];
   WebObject webObject = params['mainObject'];
   XPathFactory xpathFactory = XPathFactory.newInstance();
   XPath xpath = xpathFactory.newXPath();

   if (webObject.isCompoundStory()) {
      Story rootStory = webObject.getRootStory();
      NUKLogger.out.info('Number of Children of current story  ' + rootStory.getChildrenCount())

      Story[] Stories = rootStory.getSubBundleStories();
      if ((Stories != null) && (Stories.length > 0)) {
         NUKLogger.out.info("Number of stories  " + Stories.length);
         for (StoryImpl cur_story : Stories) {
         try {
             XPathExpression expr = xpath.compile("//productInfo/name/text()");
             channel = (String) expr.evaluate(cur_story.getSystemMetadata().getDocument(), XPathConstants.STRING);
             NUKLogger.out.info("Channel of current Story "+ channel);
             if (channel.contains("Digital")) {
                NUKLogger.out.info("Running action for Digital Channel");
                NUKLogger.out.info("Action Run Successfully " +cur_story.getEomDbObject().getEomObject().do_action("Send_to_Edition_Builder", ""));
             }
             else if (channel.contains("Print")) {
                NUKLogger.out.info("Running action for Print Channel");
                NUKLogger.out.info("Action Run Successfully " +cur_story.getEomDbObject().getEomObject().do_action("External_Text_Extract", ""));
            } else 
                NUKLogger.out.info("Current Channel is not print or web");
            } 
         catch (XPathExpressionException e) {
            e.printStackTrace();
          }
         }      
      }
        }
   else
      NUKLogger.out.info('File type is not Compound Stort')
}

main()

